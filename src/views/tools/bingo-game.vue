<template>
  <div class="bingo-container">
    <!-- 工具标题和描述 -->
    <div class="tool-header">
      <h1>宾果游戏生成器</h1>
      <p class="tool-description">
        创建并分享你独特的宾果游戏板，适用于团建、派对或个人娱乐。轻松编辑、保存和导入游戏。
      </p>
    </div>
    <!-- 模式切换按钮 -->
    <div class="mode-tabs">
      <div class="mode-buttons">
        <button :class="['tab-btn', { active: mode === 'edit' }]" @click="switchMode('edit')">
          编辑
        </button>
        <button :class="['tab-btn', { active: mode === 'play' }]" @click="switchMode('play')">
          填表
        </button>
      </div>
      <button v-if="mode === 'edit'" @click="showClearConfirmation = true" class="clear-btn">
        清空数据
      </button>
    </div>

    <!-- 清空确认弹窗 -->
    <div v-if="showClearConfirmation" class="clear-confirmation">
      <div class="clear-dialog">
        <p>确定要清空所有数据吗？此操作不可撤销。</p>
        <div class="confirmation-actions">
          <button @click="clearAllData" class="clear-confirm-btn">确定</button>
          <button @click="showClearConfirmation = false" class="clear-cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 游戏内容 -->
    <div class="bingo-content">
      <!-- 标题 -->
      <div class="bingo-header">
        <div v-if="mode === 'edit'" class="editable-field">
          <input v-if="editingField === 'title'" ref="titleInput" v-model="gameData.title"
            @blur="finishEditing('title')" @keyup.enter="finishEditing('title')" placeholder="输入标题"
            class="inline-edit" />
          <h2 v-else @click="startEditing('title')" class="editable">
            {{ gameData.title || '点击编辑标题' }} 宾果
          </h2>
        </div>
        <h2 v-else>{{ gameData.title || '未命名' }} 宾果</h2>
      </div>

      <!-- 描述 -->
      <div class="bingo-description">
        <div v-if="mode === 'edit'" class="editable-field">
          <input v-if="editingField === 'description'" ref="descriptionInput" v-model="gameData.description"
            @blur="finishEditing('description')" @keyup.enter="finishEditing('description')" placeholder="输入描述"
            class="inline-edit" />
          <p v-else @click="startEditing('description')" class="editable">
            {{ gameData.description || '点击编辑描述' }}
          </p>
        </div>
        <p v-else>{{ gameData.description || '暂无描述' }}</p>
      </div>

      <!-- 填表模式的导入功能 -->
      <div v-if="mode === 'play'" class="import-section">
        <input v-model="importText" placeholder="粘贴宾果游戏数据" class="import-input" />
        <button @click="importGame" class="import-btn">导入</button>
      </div>

      <!-- 5x5 表格 -->
      <div class="bingo-grid">
        <div v-for="(cell, index) in gameData.cells" :key="index" :class="[
          'bingo-cell',
          {
            'editable': mode === 'edit',
            'selected': mode === 'play' && selectedCells[index],
            'editing': editingField === `cell-${index}`
          }
        ]" @click="handleCellClick(index)">
          <div class="cell-content" v-if="!(mode === 'edit' && editingField === `cell-${index}`)">
            {{ cell || (mode === 'edit' ? '点击编辑' : '') }}
          </div>
          <input v-else :ref="(el) => setCellInputRef(el, index)" v-model="gameData.cells[index]"
            @blur="finishEditing(`cell-${index}`)" @keyup.enter="finishEditing(`cell-${index}`)" placeholder="输入内容"
            class="cell-edit" />
        </div>
      </div>

      <!-- 分享环节（仅编辑模式） -->
      <div v-if="mode === 'edit'" class="share-section">
        <div class="share-hint">点击下方按钮复制宾果内容分享给好友 👇</div>
        <div class="share-box">
          <div class="share-controls">
            <input ref="shareInput" :value="shareCode" readonly class="share-input" />
            <button @click="copyShareCode" class="copy-btn">
              复制
            </button>
          </div>
          <div class="copy-feedback">
            <transition name="fade">
              <span v-if="showCopySuccess" class="copy-success">复制成功！</span>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'

// 游戏模式
const mode = ref<'edit' | 'play'>('edit')

// 导入文本
const importText = ref('')

// 正在编辑的字段
const editingField = ref<string | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const descriptionInput = ref<HTMLInputElement | null>(null)
const cellInputs = ref<HTMLInputElement[]>([])

// 添加一个方法来设置单元格输入框的 ref
const setCellInputRef = (el: HTMLInputElement | null, index: number) => {
  if (!cellInputs.value) {
    cellInputs.value = []
  }

  // 确保数组有足够的长度
  while (cellInputs.value.length <= index) {
    cellInputs.value.push(null as any)
  }

  cellInputs.value[index] = el as HTMLInputElement | null
}

// 游戏数据
const initialGameData = {
  title: '',
  description: '',
  cells: Array(25).fill('')
}

const gameData = reactive({ ...initialGameData })

// 选中的单元格（仅用于填表模式）
const selectedCells = reactive(Array(25).fill(false))

// 从本地存储加载数据
const loadSavedData = () => {
  const savedData = localStorage.getItem('bingo-game-data')
  console.log('尝试加载保存的数据:', savedData)

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      console.log('解析后的数据:', parsed)

      gameData.title = parsed.title || ''
      gameData.description = parsed.description || ''
      gameData.cells = Array.isArray(parsed.cells) ?
        parsed.cells.map((cell: string | null) => cell || '') :
        Array(25).fill('')

      console.log('加载后的游戏数据:', { ...gameData })
    } catch (e) {
      console.error('加载保存的数据失败:', e)
    }
  } else {
    console.log('没有找到保存的数据')
  }
}

// 生成分享代码
const shareCode = computed(() => {
  try {
    // 保留空单元格的位置信息
    const cleanData = {
      title: gameData.title ? gameData.title.slice(0, 100) : '',
      description: gameData.description ? gameData.description.slice(0, 200) : '',
      cells: gameData.cells.map(cell => cell ? cell.slice(0, 50) : '')
    }

    // 移除所有 undefined 的字段
    const data = JSON.stringify(cleanData)
    const base64 = btoa(unescape(encodeURIComponent(data)))
    return base64.split('').reverse().join('')
  } catch (e) {
    console.error('生成分享代码时出错:', e)
    return ''
  }
})

// 复制成功提示
const showCopySuccess = ref(false)

// 复制分享代码
const copyShareCode = async () => {
  try {
    await navigator.clipboard.writeText(shareCode.value)
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

// 初始化时加载数据
onMounted(() => {
  console.log('组件挂载，当前模式:', mode.value)
  loadSavedData()
})

// 监听编辑模式下的数据变化，保存到本地存储
watch([() => gameData.title, () => gameData.description, () => gameData.cells], () => {
  if (mode.value === 'edit') {
    localStorage.setItem('bingo-game-data', JSON.stringify({
      title: gameData.title,
      description: gameData.description,
      cells: gameData.cells
    }))
  }
}, { deep: true })

// 切换模式
const switchMode = async (newMode: 'edit' | 'play') => {
  console.log(`尝试切换模式: ${mode.value} -> ${newMode}`)

  // 如果已经是当前模式，强制重新加载
  if (newMode === mode.value) {
    console.log('强制重新加载数据')
    // 使用 setTimeout 代替 nextTick，避免可能的渲染问题
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  // 重置编辑状态
  editingField.value = null

  if (newMode === 'play') {
    // 切换到填表模式时重置所有数据
    Object.assign(gameData, initialGameData)
    selectedCells.fill(false)
    console.log('切换到填表模式，重置数据')
  } else {
    // 切换到编辑模式时立即加载保存的数据
    console.log('切换到编辑模式，加载保存的数据')
    loadSavedData()
  }

  // 最后更新模式，确保响应式更新
  mode.value = newMode
}

// 开始编辑
const startEditing = (field: string) => {
  console.log(`开始编辑: ${field}`)

  // 强制设置为编辑模式
  mode.value = 'edit'
  editingField.value = field

  // 使用 setTimeout 代替 nextTick，确保 DOM 完全更新
  setTimeout(() => {
    let elementToFocus: HTMLInputElement | null = null

    if (field === 'title') {
      elementToFocus = titleInput.value
      console.log('标题输入框:', elementToFocus)
    } else if (field === 'description') {
      elementToFocus = descriptionInput.value
      console.log('描述输入框:', elementToFocus)
    } else if (field.startsWith('cell-')) {
      const index = parseInt(field.replace('cell-', ''))
      console.log('尝试聚焦单元格:', index)
      console.log('cellInputs 数组长度:', cellInputs.value.length)
      console.log('cellInputs:', cellInputs.value.map(el => el ? '有元素' : '空'))

      elementToFocus = cellInputs.value[index] || null
      console.log(`单元格 ${index} 输入框:`, elementToFocus)
    }

    if (elementToFocus) {
      elementToFocus.focus()
      elementToFocus.select() // 额外添加选中效果
      console.log(`成功聚焦元素: ${field}`)
    } else {
      console.error(`未找到要聚焦的元素: ${field}`)
    }
  }, 0)
}

// 处理单元格点击
const handleCellClick = (index: number) => {
  console.log(`点击单元格: ${index}, 当前模式: ${mode.value}`)
  if (mode.value === 'edit') {
    // 确保总是尝试编辑
    startEditing(`cell-${index}`)
  } else {
    selectedCells[index] = !selectedCells[index]
  }
}

// 完成编辑
const finishEditing = (field: string) => {
  console.log(`完成编辑: ${field}`)

  // 只有在当前正在编辑的字段匹配时才清除
  if (editingField.value === field) {
    editingField.value = null
  }
}

// 导入游戏数据
const importGame = () => {
  console.log('开始导入数据，导入文本:', importText.value)

  try {
    const reversed = importText.value.split('').reverse().join('')
    console.log('逆序后的文本:', reversed)

    // 使用更安全的解码方法
    const jsonStr = decodeURIComponent(escape(atob(reversed)))
    console.log('解码后的JSON字符串:', jsonStr)

    const imported = JSON.parse(jsonStr)
    console.log('解析后的导入数据:', imported)

    // 重置数据
    Object.assign(gameData, initialGameData)

    // 更新有效数据
    gameData.title = imported.title ? imported.title.slice(0, 100) : ''
    gameData.description = imported.description ? imported.description.slice(0, 200) : ''

    // 确保 cells 总是有 25 个元素，空值用空字符串填充
    gameData.cells = (imported.cells || []).slice(0, 25)
    while (gameData.cells.length < 25) {
      gameData.cells.push('')
    }

    importText.value = ''
    console.log('导入完成后的游戏数据:', { ...gameData })
  } catch (e) {
    console.error('导入失败:', e)
    alert('导入失败：无效的数据格式')
  }
}

// 添加清空确认的响应式变量
const showClearConfirmation = ref(false)

// 清空所有数据的方法
const clearAllData = () => {
  // 重置游戏数据
  Object.assign(gameData, initialGameData)
  
  // 清空本地存储
  localStorage.removeItem('bingo-game-data')
  
  // 重置选中状态
  selectedCells.splice(0, selectedCells.length, ...Array(25).fill(false))
  
  // 关闭确认弹窗
  showClearConfirmation.value = false
  
  // 可选：添加清空成功的提示
  console.log('已清空所有数据')
}
</script>

<style scoped>
.bingo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.mode-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.mode-buttons {
  display: flex;
  gap: 1rem;
}

.tab-btn {
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
}

.bingo-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bingo-header {
  text-align: center;
  margin-bottom: 1rem;
}

.bingo-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.bingo-description {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
}

.import-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.import-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.import-btn {
  padding: 0.5rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.bingo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  aspect-ratio: 1;
  margin-bottom: 2rem;
}

.bingo-cell {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
  min-height: 4rem;
  word-break: break-word;
  position: relative;
}

.cell-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-edit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0.5rem;
  border: none;
  background: white;
  font-size: inherit;
  text-align: center;
  outline: 2px solid #3b82f6;
  border-radius: 0.5rem;
  z-index: 1;
}

.bingo-cell.editable {
  cursor: text;
  transition: background-color 0.2s;
}

.bingo-cell.editable:hover {
  background: #f3f4f6;
}

.bingo-cell.selected {
  background: #93c5fd;
  color: white;
}

.editable {
  cursor: text;
  transition: opacity 0.2s;
}

.editable:hover {
  opacity: 0.7;
}

.editable-field {
  position: relative;
  display: inline-block;
}

.inline-edit,
.cell-edit {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: inherit;
  text-align: inherit;
  background: white;
}

.share-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.share-hint {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
}

.share-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.share-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f9fafb;
  color: #666;
}

.copy-btn {
  padding: 0.5rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #2563eb;
}

.copy-feedback {
  height: 24px; /* 预留固定高度 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.copy-success {
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: #ecfdf5;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.clear-btn {
  padding: 0.5rem 2rem;
  background: #f3f4f6;
  color: #666;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #dc2626;
}

.clear-confirmation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.clear-dialog {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.clear-confirm-btn {
  padding: 0.5rem 2rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-confirm-btn:hover {
  background: #b91c1c;
}

.clear-cancel-btn {
  padding: 0.5rem 2rem;
  background: #f3f4f6;
  color: #666;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-cancel-btn:hover {
  background: #e5e7eb;
}

.tool-header {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.tool-header h1 {
  color: #2563eb;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.tool-description {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
}
</style>
