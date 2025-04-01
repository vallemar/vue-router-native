<script lang="ts" setup>
import { ref, $navigateBack, inject, onMounted } from 'nativescript-vue';
import { useRouter } from 'vue-router';
/* const test = inject('testProvide', 'testProvide Not Found');
const props = defineProps({
  from: {
    type: String,
    default: 'NOT PROP PASSED',
  },
}); */
const router = useRouter();
</script>

<template>
  <Page actionBarHidden="true" id="depth2">
    <GridLayout rows="auto, *">
      <Label
        text="Back"
        @tap="router.back()"
        class="text-center px-4 py-10 text-2xl text-gray-900 font-bold"
      />

      <ContentView row="1" class="bg-blue-600 rounded-t-3xl">
        <Label text="Depth2"></Label>
      </ContentView>
    </GridLayout>
  </Page>
</template>
