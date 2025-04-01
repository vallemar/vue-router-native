<script lang="ts" setup>
import { GridLayout, StackLayout } from '@nativescript/core';
import { useRouter } from 'vue-router';

const router = useRouter();

function navigate() {}
</script>

<template>
  <GridLayout>
    <NativeRouterView initialPath="/"></NativeRouterView>
  </GridLayout>
</template>
