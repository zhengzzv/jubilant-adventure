<script setup lang="ts">
import { onMounted, ref } from "vue"
import { api } from "@/utils/service"

interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 40
})

const domRef = ref<HTMLCanvasElement>()
const code = ref("")
function getImgCode() {
  api.UserAPi.loginCode().then((res: any) => {
    code.value = res.data
    if (!domRef.value) {
      return
    }
    draw(domRef.value, props.width, props.height, code.value)
  })
}

onMounted(() => {
  getImgCode()
})

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function randomColor(min: number, max: number) {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

function draw(dom: HTMLCanvasElement, width: number, height: number, code: string) {
  const ctx = dom.getContext("2d")
  if (!ctx) return
  /**绘制背景色 */
  ctx.fillStyle = randomColor(180, 230)
  ctx.fillRect(0, 0, width, height)
  /**绘制文字*/
  for (let i = 0; i < 6; i += 1) {
    const text = code.toString().charAt(i)
    const fontSize = randomNum(18, 41)
    const deg = randomNum(-30, 30)
    ctx.font = `${fontSize}px Simhei`
    ctx.textBaseline = "top"
    ctx.fillStyle = randomColor(80, 150)
    ctx.save()
    ctx.translate(30 * i + 15, 15)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.fillText(text, -15 + 5, -15)
    ctx.restore()
  }
  /**绘制干扰线**/
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = randomColor(40, 180)
    ctx.beginPath()
    ctx.moveTo(randomNum(0, width), randomNum(0, height))
    ctx.lineTo(randomNum(0, width), randomNum(0, height))
    ctx.stroke()
  }
  /**绘制干扰点**/
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = randomColor(0, 255)
    ctx.beginPath()
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}
</script>

<template>
  <canvas ref="domRef" :width="props.width" :height="props.height" class="cursor-pointer" @click="getImgCode" />
</template>
