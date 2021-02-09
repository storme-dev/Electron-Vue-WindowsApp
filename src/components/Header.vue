<template>
    <div class="ui big secondary pointing menu">
        <a class="item" v-for="(item, index) in menuItems" :key="item.route" :class="{ active: currentMenuItem == index }">
            {{ item.title }}
        </a>
        <div class="right menu">
            <div style="display: flex; align-items: center;">
                <a class="ui large label">
                    <div class="detail">Дима</div>
                    10000 руб
                </a>
                <a class="ui large label">
                    <div class="detail">Юра</div>
                    10000 руб
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    computed: {
        currentMenuItem() {
            return this.$store.state.currentMenuItem;
        },
        menuItems() {
            return this.$store.state.menuItems;
        }
    }
}
</script>