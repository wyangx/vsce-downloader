<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'

const inputText = ref('')
const showResult = ref(false)
const errorMessage = ref('')
const message = ref('')
const result = reactive({
  publisher: '',
  pluginName: '',
  version: '',
  downloadUrl: ''
})

const useExample = () => {
  inputText.value = `Version    5.9.20250715
Released on    2019/6/11 06:23:13
Last updated    2025/7/16 08:18:08
Publisher    Microsoft
Unique Identifier    ms-vscode.vscode-typescript-next`
}

const parseInfo = () => {
  errorMessage.value = ''
  message.value = ''
  const lines = inputText.value.split('\n')
  const val = (k: string): string => {
    for (const l of lines) {
      if (l.trim().startsWith(k)) return l.replace(k, '').trim()
    }
    return ''
  }
  const version = val('Version')
  const identifier = val('Unique Identifier')
  if (!version || !identifier) {
    errorMessage.value = '缺少 Version 或 Unique Identifier 字段，请核对原始文本'
    showResult.value = true
    return
  }
  const [pub, ...rest] = identifier.split('.')
  if (!pub || rest.length === 0) {
    errorMessage.value = 'Unique Identifier 格式异常'
    showResult.value = true
    return
  }
  const plugin = rest.join('.')
  result.publisher = pub
  result.pluginName = plugin
  result.version = version
  result.downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${pub}/vsextensions/${plugin}/${version}/vspackage`
  showResult.value = true
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(result.downloadUrl).then(() => {
    message.value = '已复制到剪贴板'
    setTimeout(() => message.value = '', 2000)
  }).catch(() => {
    errorMessage.value = '复制失败'
  })
}
</script>

<template>
  <div class="bg-gray-100 text-gray-800">
    <div class="min-h-screen py-8 px-4 flex items-center justify-center">
      <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
        <!-- 头部 -->
        <header class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-center text-gray-700">
            VSCode 插件下载器
          </h1>
          <p class="text-sm text-gray-400 text-center mt-1">
            把插件市场的信息粘进来，一键得到下载链接
          </p>
        </header>

        <main class="p-6 space-y-6">
          <!-- 输入区 -->
          <div>
            <label class="block text-sm font-medium mb-2">插件信息粘贴区</label>
            <textarea v-model="inputText" placeholder="Version    5.9.20250715
Released on    ...
Publisher    Microsoft
Unique Identifier    ms-vscode.vscode-typescript-next"
              class="w-full h-40 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"></textarea>

            <div class="flex gap-2 mt-3 flex-wrap">
              <button
                class="flex-1 sm:flex-none min-w-[100px] px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold transition"
                @click="parseInfo">
                <i class="fa-solid fa-magic mr-1"></i>解析
              </button>
              <button
                class="flex-1 sm:flex-none min-w-[100px] px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                @click="inputText = ''">清空</button>
              <button
                class="flex-1 sm:flex-none min-w-[100px] px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                @click="useExample">示例</button>
            </div>
          </div>

          <!-- 结果区 -->
          <transition name="slide-up">
            <div v-if="showResult" class="pt-4 border-t border-gray-100">
              <h2 class="text-lg font-bold mb-4 text-gray-700">解析结果</h2>

              <!-- 预览卡 -->
              <div class="grid gap-3 sm:grid-cols-3 text-sm">
                <div class="bg-gray-50 rounded-md p-3">
                  <div class="text-gray-400 text-xs">发布者</div>
                  <div class="font-semibold truncate text-gray-700">{{ result.publisher || '-' }}</div>
                </div>
                <div class="bg-gray-50 rounded-md p-3">
                  <div class="text-gray-400 text-xs">插件名</div>
                  <div class="font-semibold truncate text-gray-700">{{ result.pluginName || '-' }}</div>
                </div>
                <div class="bg-gray-50 rounded-md p-3">
                  <div class="text-gray-400 text-xs">版本</div>
                  <div class="font-semibold truncate text-gray-700">{{ result.version || '-' }}</div>
                </div>
              </div>

              <div class="mt-4">
                <label class="text-sm font-medium">下载地址</label>
                <div class="flex gap-2 mt-1">
                  <input readonly :value="result.downloadUrl"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    @click="($event.target as HTMLInputElement).select()" />
                  <button
                    class="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 active:scale-95 text-white transition"
                    @click="copyToClipboard">
                    <Icon icon="mdi:content-copy" />
                  </button>
                  <a :href="result.downloadUrl" target="_blank" v-if="result.downloadUrl"
                    class="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 active:scale-95 text-white transition flex items-center justify-center">
                    <Icon icon="mdi:download" />
                  </a>
                </div>
              </div>

              <p v-if="errorMessage" class="text-sm text-red-600 mt-3">{{ errorMessage }}</p>
              <p v-if="message" class="text-sm text-green-600 mt-3">{{ message }}</p>
            </div>
          </transition>
        </main>

        <footer class="text-xs text-gray-400 p-4 border-t border-gray-200">
          提示：粘贴需包含&nbsp;<b>Version</b>、<b>Unique Identifier</b>&nbsp;等字段；复制后请手动安装 <code>.vsix</code>&nbsp;文件。
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 让滑入动画更顺滑 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all .35s cubic-bezier(.4, 0, .2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
