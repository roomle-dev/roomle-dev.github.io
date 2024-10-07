<template>
  <div id="roomle-configurator" ref="embeddingTarget" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RoomleEmbeddingApi from '@roomle/embedding-lib'
import { downloadZip } from 'client-zip'

interface TechnicalDataItem {
  constructionPrincipleId: string

  [key: string]: unknown
}

interface TechnicalData {
  items: TechnicalDataItem[]
}

interface Position {
  positionData: TechnicalDataItem & { moduleId: string }

  [key: string]: unknown
}

export interface Base64Image {
  image: string
  width: number
  height: number
  blob: Blob
}

const instance = ref()
const embeddingTarget = ref()

const generateNewPosition = (id: number): Position => {
  const position = {
    id: id.toString(),
    attributes: {},
    files: [], // These would be perspectiveImages of the product?
    positionType: 'tecConfig', // We leave this alone?
    positionData: {}
  }
  return JSON.parse(JSON.stringify(position))
}

const generatePositions = (technicalData: TechnicalData) => {
  const positions: Position[] = []
  let currentId = 0
  const items = technicalData?.items || []

  for (const item of items) {
    const newPosition = generateNewPosition(currentId)
    currentId++

    newPosition.positionData = {
      ...item,
      moduleId: item.constructionPrincipleId
    }

    positions.push(newPosition)
  }
  return positions
}

function handleBase64Image(base64String: string) {
  // Remove the data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/png;base64,/, '')

  // Convert base64 to Blob
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: 'image/png' })
}

async function downloadTestZip(jsonString: string, perspectiveImage: Base64Image) {
  const imageBlob = handleBase64Image(perspectiveImage.image)
  const order = {
    name: 'order.json',
    lastModified: new Date(),
    input: jsonString
  }

  const imageFile = new File([imageBlob], 'image/png')

  const image = {
    name: '1.png',
    lastModified: new Date(),
    input: imageFile
  }

  const blob = await downloadZip([order, image]).blob()

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'order.zip'
  link.click()
  link.remove()
}

onMounted(async () => {
  const options = {
    id: 'biohort:CasaNova_Master:2632C3D0CD7357D8F7339DA0A023F0C987728931661D5F12DBA5A326FF499CEA',
    api: true,
    moc: false,
    saveToIdb: false,
    buttons: {
      savedraft: false
    }
  }

  instance.value = await RoomleEmbeddingApi.createConfigurator(
    'biohort',
    embeddingTarget.value!,
    options
  )

  instance.value.ui.callbacks.onRequestProduct = async () => {
    const technicalData = await instance.value.extended.generateTCExport()
    const perspectiveImage: Base64Image = await instance.value.extended.preparePerspectiveImage()
    const positionData = generatePositions(technicalData)
    await downloadTestZip(JSON.stringify(positionData), perspectiveImage)
  }
})
</script>

<style>
#roomle-configurator {
  height: 100%;
  width: 100%;
}

iframe {
  border: none;
}
</style>
