<style lang="sass">
    a
        color: #fff !important
    a:active
        color: #fff !important
    a:visited
        color: #fff !important
    a:link
        color: #fff !important
    a:hover
        color: steelblue !important
        transition: 0.3s

</style>

<template>
    
    <v-footer 
        padless
        dark
    >

     
        <v-col
        cols="6"
        class="text-left"
        style="font-size: 9pt"
        >
           MSDV
        </v-col>
        <v-col
        cols="6"
        class="text-right"
        style="font-size: 9pt"
        >
            &copy; <a href="mailto:yoana.kosturska@gmail.com">Yoana Kosturska</a>  - {{ new Date().getFullYear() }}
        </v-col>    

    </v-footer>

</template>

<script>

export default {
     name: 'Footer'
}

</script>
