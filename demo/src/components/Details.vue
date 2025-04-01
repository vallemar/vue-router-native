<script lang="ts" setup>
import { ref, $navigateBack, inject, onMounted } from 'nativescript-vue';
import { useRouter } from 'vue-router';
const test = inject('testProvide', 'testProvide Not Found');
const props = defineProps({
  from: {
    type: String,
    default: 'NOT PROP PASSED',
  },
});
const emits = defineEmits(['update']);
console.log('[ROUTER] props from navigation:', props.from);

setTimeout(() => {
  emits('update', 'on emit emmited from child');
}, 1000);

const counter = ref(0);

let interval: any;
onMounted(() => {
  console.log('mounted');
  interval = setInterval(() => counter.value++, 100);
});

const items = ref(
  Array(1000)
    .fill(0)
    .map((_, index) => `Item ${index + 1}`),
);
const router = useRouter();
function navigate() {
  console.log('[ROUTER] current path:', router.currentRoute.value.fullPath);
  router.push({
    path: '/base/depth2',
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
  <Page actionBarHidden="true">
    <StackLayout rows="auto, *" class="bg-gray-100">
      <!--  <Label
        :text="counter + ' - BACK TO HOME'"
        @tap="router.back()"
        class="text-center px-4 py-10 text-2xl text-gray-900 font-bold"
      /> -->
      <Label
        text="Details"
        class="text-center px-4 py-10 text-gray-900 font-bold"
      />
      <Label
        :text="'Go Depth2 ' + ' - ' + counter"
        textWrap="true"
        @tap="navigate"
        class="text-center px-4 py-2 text-2xl text-gray-900 font-bold"
      />
    </StackLayout>
  </Page>
</template>
