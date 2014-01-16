// *********************************
//
//   Colorplane - by Daniel Zarick
//   Repo: https://github.com/danielzarick/Colorplane
//   for more: http://33cc77.com
//
//   Forked by Jeremiah Senkpiel
//   Source commit: d0555e079e2dbdbfe9a54f3289b21c8fd7aed738
//   Current fork version: 0.0.0
//
// *********************************

(function($){
  var ColorPlane = function(element, options) {
    this.$el           = $(element || '<div />').addClass('colorplane')
    this.$instructions = $('<div class="colorplane-selected-color"><div class="colorplane-instructions">Click to select a color</div></div>')
    this.$canvas       = $('<canvas />')
    this.$color        = this.$canvas.css("background")
    this.context       = this.$canvas[0].getContext('2d')
    this.options       = options || {}

    this.render()
  }

  ColorPlane.fn = ColorPlane.prototype

  ColorPlane.fn.render = function(){
    this.$el.html(this.$canvas)
    this.$el.prepend(this.$instructions)
    this.context.fillStyle = this.$color
    this.addListeners()
  }

  ColorPlane.fn.addListeners = function() {
    this.$canvas.bind('touchmove', function(e) {
      e.preventDefault()
      var touch    = e.originalEvent.changedTouches[0]
        , hexColor = this.getHexColor(touch)
      this.showColor(hexColor)

      this.$canvas.one('touchend', function() {
        this.saveCurrentColor(hexColor)
      }.bind(this))
    }.bind(this))

    this.$canvas.bind('mousemove', function(e) {
      var hexColor = this.getHexColor(e)
      this.showColor(hexColor)

      this.$canvas.one('click', function() {
        this.saveCurrentColor(hexColor)
      }.bind(this))
    }.bind(this))
  }

  ColorPlane.fn.getHexColor = function(e) {
    var canvasOffset = this.$canvas.offset()
      , X = e.pageX - canvasOffset.left
      , Y = e.pageY - canvasOffset.top
      , canvasX = Math.floor(X/2)
      , canvasY = Math.floor(Y)
      , canvasZ = parseInt(canvasX.toString().slice(0,2))
                + parseInt(canvasY.toString().slice(0,2))

    return "#" + normalizeHex(canvasX) + normalizeHex(canvasY) + normalizeHex(canvasZ)
  }

  function normalizeHex(value) {
    var hexLetters =  {
          "10": "A"
        , "11": "B"
        , "12": "C"
        , "13": "D"
        , "14": "E"
        , "15": "F"
      }
      , value = value.toString()

    if (value.length === 1) {
      return "0" + value

    } else if (value.length === 3) {
      var value1 = value.slice(0,2)

      if (hexLetters[value1]) {
        value1 = hexLetters[value1]
      } else {
        value1 = "F"
      }
      return value1 + value.slice(2,3)

    } else {
      return value
    }
  }

  ColorPlane.fn.showColor = function(hexColor) {
    this.context.fillStyle = hexColor
    this.context.fillRect(0,0, this.$canvas.width(), this.$canvas.height())

    $('#colorplane-current-hex').html(hexColor)
    $('#colorplane-current-hex').css("color", hexColor)
  }

  ColorPlane.fn.saveCurrentColor = function(hexColor) {
    this.$el.trigger('change', hexColor)

    $('#colorplane-selected-hex').html(hexColor)
    $('#colorplane-selected-hex').css("color", hexColor)
    $('.colorplane-selected-color').css("background", hexColor)
    $('.colorplane-instructions').html("Color selected!")
  }

  $.fn.colorplane = function(options){
    return $(this).each(function(){
      $(this).data('colorplane', new ColorPlane(this, options))
    })
  }
})(jQuery)

jQuery(function($){
  $('.colorplane').colorplane()
})
