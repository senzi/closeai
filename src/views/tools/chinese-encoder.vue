<template>
  <div class="chinese-encoder">
    <h2>汉字编码工具</h2>
    
    <div class="tab-container">
      <div class="tab-buttons">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content" v-show="currentTab === 'encode'">
        <textarea
          v-model="encodeInput"
          placeholder="请输入要编码的文本"
          rows="4"
        ></textarea>
        <div class="output-container">
          <textarea
            v-model="encodeOutput"
            placeholder="编码结果将在这里显示"
            rows="4"
            readonly
          ></textarea>
          <button 
            v-if="encodeOutput"
            class="copy-button"
            :class="{ success: copyStatus === 'success', error: copyStatus === 'error' }"
            @click="copyToClipboard(encodeOutput)"
          >
            {{ copyButtonText }}
          </button>
        </div>
      </div>

      <div class="tab-content" v-show="currentTab === 'decode'">
        <textarea
          v-model="decodeInput"
          placeholder="请输入要解码的文本"
          rows="4"
        ></textarea>
        <div class="output-container">
          <textarea
            v-model="decodeOutput"
            placeholder="解码结果将在这里显示"
            rows="4"
            readonly
          ></textarea>
          <button 
            v-if="decodeOutput"
            class="copy-button"
            :class="{ success: copyStatus === 'success', error: copyStatus === 'error' }"
            @click="copyToClipboard(decodeOutput)"
          >
            {{ copyButtonText }}
          </button>
        </div>
      </div>

      <div class="tab-content" v-show="currentTab === 'algorithm'">
        <div class="algorithm-content">
          <h3>编码算法说明：</h3>
          <ol>
            <li>添加特定的头尾标记，方便脚本识别</li>
            <li>对原文进行UTF-8编码</li>
            <li>使用pako进行压缩</li>
            <li>进行Base64编码</li>
            <li>对结果进行逆序处理</li>
            <li>添加特定标记</li>
          </ol>
          <p>解码过程与之相反。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import pako from 'pako'

// 定义标签页
const tabs = [
  { id: 'encode', name: '编码' },
  { id: 'decode', name: '解码' },
  { id: 'algorithm', name: '算法披露' }
]

const currentTab = ref('encode')
const encodeInput = ref('')
const encodeOutput = ref('')
const decodeInput = ref('')
const decodeOutput = ref('')
const copyStatus = ref('')
const copyButtonText = ref('复制')

// 监听输入变化，实时计算
watch(encodeInput, (newValue) => {
  if (newValue.trim()) {
    try {
      encodeOutput.value = encode(newValue)
    } catch (error) {
      console.error('编码错误:', error)
      // 保持原有输出不变
    }
  } else {
    encodeOutput.value = ''
  }
})

watch(decodeInput, (newValue) => {
  if (newValue.trim()) {
    try {
      decodeOutput.value = decode(newValue)
    } catch (error) {
      console.error('解码错误:', error)
      // 保持原有输出不变
    }
  } else {
    decodeOutput.value = ''
  }
})

// 特定标记
const MARKER_START = '【CloseAI::'
const MARKER_END = '::End】'

// 编码函数
const encode = (text: string): string => {
  try {
    // 1. UTF-8编码（文本已经是UTF-8了，不需要特别处理）
    // 2. Pako压缩
    const compressed = pako.deflate(text)
    // 3. Base64编码
    const base64 = btoa(String.fromCharCode.apply(null, compressed))
    // 4. 逆序
    const reversed = base64.split('').reverse().join('')
    // 5. 添加标记
    return MARKER_START + reversed + MARKER_END
  } catch (error) {
    console.error('编码错误:', error)
    return '编码失败：' + (error as Error).message
  }
}

// 解码函数
const decode = (text: string): string => {
  try {
    console.log('Input text:', text)
    console.log('Marker start:', MARKER_START)
    console.log('Marker end:', MARKER_END)
    
    // 1. 查找所有可能的编码内容
    const escapedStart = MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const escapedEnd = MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`${escapedStart}(.*?)${escapedEnd}`, 'g')
    console.log('Pattern:', pattern)
    
    const matches = text.match(pattern)
    console.log('Matches:', matches)
    
    if (!matches || matches.length === 0) {
      // 让我们看看是否能直接匹配标记
      console.log('Has start marker:', text.includes(MARKER_START))
      console.log('Has end marker:', text.includes(MARKER_END))
      // 尝试直接解码整个文本
      if (text.startsWith(MARKER_START) && text.endsWith(MARKER_END)) {
        console.log('Text has correct markers, trying direct decode')
        const content = text.slice(MARKER_START.length, -MARKER_END.length)
        console.log('Content:', content)
        // 反转
        const unreversed = content.split('').reverse().join('')
        console.log('Unreversed:', unreversed)
        // Base64解码
        const decoded = atob(unreversed)
        // Pako解压
        const uint8Array = new Uint8Array(decoded.length)
        for (let i = 0; i < decoded.length; i++) {
          uint8Array[i] = decoded.charCodeAt(i)
        }
        const decompressed = pako.inflate(uint8Array)
        // UTF-8解码
        return new TextDecoder().decode(decompressed)
      }
      return '未找到有效的编码内容'
    }

    // 解码所有找到的内容
    const results = matches.map(encoded => {
      try {
        console.log('Decoding:', encoded)
        // 移除标记
        const content = encoded.slice(MARKER_START.length, -MARKER_END.length)
        // 反转
        const unreversed = content.split('').reverse().join('')
        // Base64解码
        const decoded = atob(unreversed)
        // Pako解压
        const uint8Array = new Uint8Array(decoded.length)
        for (let i = 0; i < decoded.length; i++) {
          uint8Array[i] = decoded.charCodeAt(i)
        }
        const decompressed = pako.inflate(uint8Array)
        // UTF-8解码
        return new TextDecoder().decode(decompressed)
      } catch (e) {
        console.error('Failed to decode:', e)
        return `[解码失败: ${e.message}]`
      }
    })

    // 如果只有一个结果，直接返回
    if (results.length === 1) {
      return results[0]
    }
    
    // 如果有多个结果，标注序号返回
    return results.map((result, index) => 
      `[编码内容 ${index + 1}]\n${result}`
    ).join('\n\n')

  } catch (error) {
    console.error('解码错误:', error)
    return '解码失败：' + (error as Error).message
  }
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'success'
    copyButtonText.value = '已复制'
    setTimeout(() => {
      copyStatus.value = ''
      copyButtonText.value = '复制'
    }, 2000)
  } catch (err) {
    copyStatus.value = 'error'
    copyButtonText.value = '复制失败'
    setTimeout(() => {
      copyStatus.value = ''
      copyButtonText.value = '复制'
    }, 2000)
  }
}
</script>

<style scoped>
.chinese-encoder {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.tab-container {
  margin-top: 20px;
}

.tab-buttons {
  margin-bottom: 20px;
  display: flex;
  gap: 8px;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.tab-button.active {
  background-color: #1890ff;
  color: white;
}

.tab-content {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

textarea[readonly] {
  background-color: #f5f5f5;
  cursor: default;
}

.algorithm-content {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
}

.algorithm-content h3 {
  margin-top: 0;
  color: #1890ff;
}

.algorithm-content ol {
  padding-left: 20px;
}

.algorithm-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.output-container {
  position: relative;
  margin-bottom: 16px;
}

.output-container textarea {
  width: 100%;
  margin-bottom: 0;
}

.copy-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 4px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: #e0e0e0;
}

.copy-button.success {
  background-color: #52c41a;
  color: white;
}

.copy-button.error {
  background-color: #ff4d4f;
  color: white;
}
</style>
