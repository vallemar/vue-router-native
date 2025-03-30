<script lang="ts" setup>
import { provide, getCurrent, getCurrentInstance } from 'nativescript-vue';
import { useRouter } from 'vue-router';
provide('testProvide', 'testProvideValue');
const router = useRouter();

function navigate() {
  console.log('[ROUTER] current path:', router.currentRoute.value.fullPath);
  router.push({
    path: '/details',
    state: {
      from: 'home',
      onUpdate(data) {
        console.log('[ROUTER] onUpdate', data);
      },
    },
  });
}
</script>

<template>
  <Frame>
    <Page>
      <ActionBar>
        <Label text="Home" class="font-bold text-lg" />
      </ActionBar>

      <GridLayout rows="*, auto, auto, *" class="px-4">
        <Button
          row="2"
          @tap="navigate"
          class="mt-4 px-4 py-2 bg-white border-2 border-blue-400 rounded-lg"
          horizontalAlignment="center"
        >
          View Details
        </Button>
      </GridLayout>
    </Page>
  </Frame>
</template>
