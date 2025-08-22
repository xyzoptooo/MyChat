<template>
  <div class="emoji-picker" v-if="show">
    <div class="emoji-grid">
      <span 
        v-for="emoji in emojis" 
        :key="emoji"
        @click="selectEmoji(emoji)"
        class="emoji-item"
      >
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  select: [emoji: string]
}>()

const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥', '💯', '🎉', '💡', '✅']

const selectEmoji = (emoji: string) => {
  emit('select', emoji)
}
</script>
//commenr 
<style scoped>
.emoji-picker {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.25rem;
}

.emoji-item {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  text-align: center;
  font-size: 1.2rem;
}

.emoji-item:hover {
  background: #f0f0f0;
}
</style>
</create_file>
