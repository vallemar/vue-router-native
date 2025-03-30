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
</script>

<template>
  <Page actionBarHidden="true">
    <GridLayout rows="auto, *">
      <Label
        :text="counter + ' - BACK TO HOME'"
        @tap="router.back()"
        class="text-center px-4 py-10 text-2xl text-gray-900 font-bold"
      />

      <ContentView row="1" class="bg-blue-600 rounded-t-3xl">
        <ListView
          :items="items"
          separatorColor="transparent"
          class="bg-transparent"
        >
          <template #default="{ item }">
            <GridLayout columns="*, auto" class="px-4">
              <Label :text="item + 'test'" class="text-3xl py-3 text-white" />
              <ContentView col="1" class="w-5 h-5 rounded-full bg-white" />
            </GridLayout>
          </template>
        </ListView>
      </ContentView>
    </GridLayout>
  </Page>
</template>
