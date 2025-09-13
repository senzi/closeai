// Local storage utilities for persisting user data
export const STORAGE_KEY = 'closeai-user-data'

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  } catch (error) {
    console.warn('Failed to save user data to localStorage:', error)
  }
}

export const loadUserData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load user data from localStorage:', error)
  }
  return null
}

export const clearUserData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear user data from localStorage:', error)
  }
}

// URL parameter utilities for sharing results
export const encodeUserDataToURL = (userData) => {
  try {
    const compressed = {
      u: Object.values(userData.usageScenarios), // usage scenarios as array
      m: userData.preferredModels, // models
      c: userData.customModel || '', // custom model
      d: [
        userData.dimensions.closeness,
        userData.dimensions.dependence,
        userData.dimensions.skepticism
      ] // dimensions as array
    }
    return btoa(JSON.stringify(compressed))
  } catch (error) {
    console.warn('Failed to encode user data to URL:', error)
    return null
  }
}

export const decodeUserDataFromURL = (encoded) => {
  try {
    const compressed = JSON.parse(atob(encoded))
    return {
      usageScenarios: {
        programming: compressed.u[0] || 50,
        creative: compressed.u[1] || 50,
        learning: compressed.u[2] || 50,
        chat: compressed.u[3] || 50,
        tasks: compressed.u[4] || 50
      },
      preferredModels: compressed.m || [],
      customModel: compressed.c || '',
      dimensions: {
        closeness: compressed.d[0] || 50,
        dependence: compressed.d[1] || 50,
        skepticism: compressed.d[2] || 50
      }
    }
  } catch (error) {
    console.warn('Failed to decode user data from URL:', error)
    return null
  }
}

export const generateShareURL = (userData) => {
  const encoded = encodeUserDataToURL(userData)
  if (encoded) {
    const baseURL = window.location.origin + window.location.pathname
    return `${baseURL}?data=${encoded}`
  }
  return window.location.href
}
