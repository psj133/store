<template>
    <div>
          <div class="md-modal modal-msg md-modal-transition"  :class="{'md-show':mdshow}" >
            <div class="md-modal-inner">
              <div class="md-top">
                <div class="md-title">Login in</div>
                <button class="md-close" @click="closeModal">Close</button>
              </div>
              <div class="md-content">
                <div class="confirm-tips">
                  <slot name="message"></slot>
                </div>
                <div class="btn-wrap" >
                  <slot name="btnGroup"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="md-overlay" @click="closeModal" v-if="mdshow"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}

        },
      props:['mdshow'],
      methods:{
        closeModal(){
          this.$emit('closeModal')
        }
      }
    }
</script>

<style>
</style>
