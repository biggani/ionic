(function(ionic) {

ionic.Platform.ready(function() {
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;
  var rememberedActiveEl;
  var alreadyOpen = false;

  if(ionic.Platform.isWebView() && window.cordova && cordova.plugins && cordova.plugins.Keyboard) {
    if (ionic.Platform.isIOS()) {
      window.addEventListener('focusin', onBrowserFocusIn);
    }
    window.addEventListener('native.showkeyboard', onNativeKeyboardShow);
    window.addEventListener('native.hidekeyboard', onNativeKeyboardHide);
  }
  else if (ionic.Platform.isAndroid()){
    window.addEventListener('resize', onBrowserResize);
    window.addEventListener('focusin', onBrowserFocusIn);
  }

  function onBrowserFocusIn(e) {
    if(e.srcElement.tagName == 'INPUT' || e.srcElement.tagName == 'TEXTAREA' || e.srcElement.isContentEditable) {
      //stop browser from scrolling the whole frame, use virtual scroll instead
      document.body.scrollTop = 0;
    }
  }

  function onBrowserResize() {
    if(rememberedDeviceWidth !== window.innerWidth) {
      // If the width of the window changes, we have an orientation change
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;

    } else if(rememberedDeviceHeight !== window.innerHeight &&
               window.innerHeight < rememberedDeviceHeight) {
      // If the height changes, and it's less than before, we have a keyboard open
      document.body.classList.add('keyboard-open');

      keyboardHeight = rememberedDeviceHeight - window.innerHeight;
      setTimeout(function() {
        ionic.trigger('scrollChildIntoView', {
          target: document.activeElement
        }, true);
      }, 100);

    } else {
      // Otherwise we have a keyboard close or a *really* weird resize
      document.body.classList.remove('keyboard-open');
    }
  }

  function onNativeKeyboardShow(e) {
    rememberedActiveEl = document.activeElement;
    if(rememberedActiveEl) {
      // This event is caught by the nearest parent scrollView
      // of the activeElement
      if(cordova.plugins.Keyboard.isVisible) {
        document.body.classList.add('keyboard-open');
        ionic.trigger('scrollChildIntoView', {
          keyboardHeight: e.keyboardHeight,
          target: rememberedActiveEl,
          firstKeyboardShow: !alreadyOpen
        }, true);
        if(!alreadyOpen) alreadyOpen = true;
      }
    }
  }

  function onNativeKeyboardHide() {
    // wait to see if we're just switching inputs
    setTimeout(function() {
      if(!cordova.plugins.Keyboard.isVisible) {
        document.body.classList.remove('keyboard-open');
        alreadyOpen = false;
        ionic.trigger('resetScrollView', {
          target: rememberedActiveEl
        }, true);
      }
    }, 100);
  }


});

})(window.ionic);
