<template>
    <ActionResult :status="404" :from="'notFound'" />
</template>

<script>
    import ActionResult from '../components/ActionResult.vue';
    export default {
        components: {
            ActionResult
        }
    }
</script>