<script lang="ts" setup>
import { StackLayout } from '@nativescript/core';
import { provide } from 'nativescript-vue';
import { useRouter } from 'vue-router';
provide('testProvide', 'testProvideValue');
const router = useRouter();

function navigate() {
  console.log('[ROUTER] current path:', router.currentRoute.value.fullPath);
  router.push({
    path: '/depth2',
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
  <Page>
    <ActionBar>
      <Label text="Home" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout rows="*, auto, auto, *" class="px-4">
      <Button
        row="2"
        @tap="navigate"
        class="mt-4 px-4 py-2 bg-white border-2 border-blue-400 rounded-lg"
        horizontalAlignment="center"
      >
        View Details
      </Button>
      <NativeRouterView
        name="routerView"
        height="200"
        width="200"
      ></NativeRouterView>
    </StackLayout>
  </Page>
</template>
