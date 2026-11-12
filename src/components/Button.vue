<script lang="ts" setup>
import Box from "@/assets/images/box.svg";
import EmptyBox from "@/assets/images/box-empty.svg";

import { breakingNews } from "@/api/data.ts";
import { useDrag } from "@/utils/useDrag.ts";
import { useEventListener } from "@/utils/useEvent.ts";
import { computed, ref, useId, useTemplateRef } from "vue";

const popoverId = `popover-${useId()}`;
const anchorName = `--anchor-${useId()}`;

const newsData = ref(breakingNews);
const buttonRef = useTemplateRef("buttonRef");
const hasNews = computed(() => newsData.value.length > 0);

// Helper method for simulating an empty news feed
function toggleNewsData(e: KeyboardEvent) {
  if (e.key === "C" && e.shiftKey) {
    newsData.value = hasNews.value ? [] : breakingNews;
  }
}

useEventListener(document, "keydown", toggleNewsData);

const { posX, posY } = useDrag(buttonRef, { startX: 48, startY: 48 });
</script>

<template>
  <button
    type="button"
    class="button"
    ref="buttonRef"
    :class="{ 'button-disabled': !hasNews }"
    :popovertarget="hasNews ? popoverId : null"
    :aria-label="`Open breaking news feed (${newsData.length})`"
    :style="`left: ${posX}px; top: ${posY}px; anchor-name: ${anchorName};`"
  >
    <img
      alt=""
      width="20"
      height="20"
      class="button__img"
      :src="hasNews ? Box : EmptyBox"
    />
    <span class="button__badge" :class="{ 'button__badge-disabled': !hasNews }">
      {{ newsData.length }}
    </span>
  </button>
  <ul
    popover
    v-if="hasNews"
    :id="popoverId"
    class="popover"
    :style="`position-anchor: ${anchorName}`"
  >
    <li v-for="article in newsData" :key="article.id">
      <a
        target="_blank"
        :href="article.link"
        class="popover__link"
        rel="noopener noreferrer"
      >
        <span class="popover__date">{{ article.meta }}</span>
        {{ article.title }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.button {
  border: 0;
  width: 3rem;
  cursor: move;
  height: 3rem;
  display: grid;
  position: fixed;
  place-items: center;
  border-radius: 0.75rem;
  background: var(--color-btn);

  &:hover {
    background: var(--color-btn-hover);
  }

  &:focus {
    outline-offset: 3px;
    outline-color: var(--color-link-hover);
  }

  &.button-disabled {
    background: var(--color-btn-disabled);

    &:hover {
      background: var(--color-btn-disabled-hover);
    }
  }

  .button__img {
    user-select: none;
    pointer-events: none;
  }

  .button__badge {
    top: -0.5rem;
    height: 1rem;
    width: 1.5rem;
    display: grid;
    right: -0.5rem;
    user-select: none;
    font-weight: bold;
    position: absolute;
    font-size: 0.75rem;
    place-items: center;
    border-radius: 0.5rem;
    color: var(--color-badge-txt);
    background: var(--color-badge);
    outline: 2px solid var(--color-bg-mute);

    &.button__badge-disabled {
      color: var(--color-badge-txt-disabled);
      background: var(--color-badge-disabled);
    }
  }
}

.popover {
  gap: 2px;
  border: 0;
  opacity: 0;
  width: 24rem;
  margin: 1rem;
  list-style: none;
  padding: 0.25rem;
  flex-direction: column;
  border-radius: 0.75rem;
  background: var(--color-bg);
  position-area: right center;
  transform: translateY(0.5rem);
  position-try-fallbacks: left, right;
  transition:
    opacity 0.2s,
    transform 0.2s,
    display 0.2s allow-discrete;

  &:popover-open {
    opacity: 1;
    display: flex;
    transform: translateY(0);
  }

  @starting-style {
    &:popover-open {
      opacity: 0;
      transform: translateY(0.5rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  .popover__link {
    gap: 0.25rem;
    display: flex;
    padding: 0.75rem;
    border-radius: 0.5rem;
    flex-direction: column;
    color: var(--color-link);

    &:hover {
      color: var(--color-link-hover);
      background: var(--color-bg-mute);
    }

    &:focus {
      color: var(--color-link-hover);
      outline-color: var(--color-link-hover);
    }

    .popover__date {
      font-size: 0.75rem;
    }
  }
}
</style>
