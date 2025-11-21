// clipboard js 代码复制功能
window.addEventListener('DOMContentLoaded', getCodeBlockDoms)

let clipboard = null

// 获取code block dom
function getCodeBlockDoms() {
  const codeBlockDoms = document.querySelectorAll('figure')
  codeBlockDoms.length && codeBlockDoms.forEach(res => {
    // 为每个代码块创建独立的复制按钮
    const copyIcon = document.createElement('i')
    copyIcon.classList = 'iconfont icon-copy'
    const copyBtn = document.createElement('span')
    copyBtn.classList = 'pin-copy'
    copyBtn.setAttribute('data-text', 'copy')
    copyBtn.appendChild(copyIcon)
    
    // 立即添加按钮到代码块
    res.appendChild(copyBtn)
    
    // 初始化复制内容
    const copyContent = res.querySelector('table tbody tr .code')
    res.setAttribute('data-clipboard-text', copyContent && copyContent.innerText || '')
    
    // 绑定点击事件
    copyBtn.addEventListener('click', function(e) {
      copyContentAction(e, res, copyBtn)
    })
    
    // 鼠标进入时更新复制内容（如果代码块内容可能动态变化）
    res.addEventListener('mouseenter', () => {
      const copyContent = res.querySelector('table tbody tr .code')
      res.setAttribute('data-clipboard-text', copyContent && copyContent.innerText || '')
    })
  })
}

// 点击复制
function copyContentAction(e, target, copyBtnDom) {
  e.preventDefault()
  e.stopPropagation()
  
  if (!target || !copyBtnDom) return
  
  const text = target.getAttribute('data-clipboard-text') || ''
  
  // 优先使用现代 Clipboard API，完全避免 ClipboardJS 创建临时元素
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      copyBtnDom.setAttribute('data-text', 'copied')
      setTimeout(() => {
        copyBtnDom.setAttribute('data-text', 'copy')
      }, 2000)
    }).catch((err) => {
      console.warn('Clipboard API failed:', err)
      // 如果 Clipboard API 失败，使用传统的 execCommand 方法
      fallbackCopyText(text, copyBtnDom)
    })
  } else {
    // 不支持 Clipboard API，使用传统的 execCommand 方法
    fallbackCopyText(text, copyBtnDom)
  }
}

// 使用传统的 execCommand 作为回退方案，避免 ClipboardJS
function fallbackCopyText(text, copyBtnDom) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '-9999px'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'
  textArea.setAttribute('readonly', '')
  document.body.appendChild(textArea)
  
  try {
    textArea.select()
    textArea.setSelectionRange(0, text.length)
    const successful = document.execCommand('copy')
    if (successful) {
      copyBtnDom.setAttribute('data-text', 'copied')
      setTimeout(() => {
        copyBtnDom.setAttribute('data-text', 'copy')
      }, 2000)
    } else {
      copyBtnDom.setAttribute('data-text', 'fail to copy')
      setTimeout(() => {
        copyBtnDom.setAttribute('data-text', 'copy')
      }, 2000)
    }
  } catch (err) {
    console.warn('Fallback copy failed:', err)
    copyBtnDom.setAttribute('data-text', 'fail to copy')
    setTimeout(() => {
      copyBtnDom.setAttribute('data-text', 'copy')
    }, 2000)
  } finally {
    document.body.removeChild(textArea)
  }
}
