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

(function(container){
  var ColorPlane = function(element) {
    this.$el           = (element || document.getElementById('colorplane'))
    this.$instructions = '<div id="colorplane-selected-color"><div id="colorplane-instructions">Click to select a color</div></div>'
    this.$canvas       = document.createElement('canvas')
    this.$color        = this.$canvas.style.background
    this.context       = this.$canvas.getContext('2d')
    this.hexColor      = '#000'

    this.$el.classList.add('colorplane')

    this.render()
  }

  ColorPlane.prototype.render = function() {
    this.$el.appendChild(this.$canvas)
    this.$el.insertAdjacentHTML('beforebegin', this.$instructions)
    this.context.fillStyle = this.$color
    this.addListeners()
  }

  ColorPlane.prototype.addListeners = function() {
    var that = this
    this.$canvas.addEventListener('touchmove', function(e) {
      e.preventDefault()
      that.getHexColor(e.originalEvent.changedTouches[0])
      that.showColor()
    })
    this.$canvas.addEventListener('touchend', function() {
      that.saveCurrentColor()
    })

    this.$canvas.addEventListener('mousemove', function(e) {
      that.getHexColor(e)
      that.showColor()
    })

    this.$canvas.addEventListener('click', function() {
      that.saveCurrentColor()
    })
  }

  ColorPlane.prototype.getHexColor = function(e) {
    var X = e.pageX - this.$canvas.offsetLeft
      , Y = e.pageY - this.$canvas.offsetTop
      , canvasX = Math.floor(X/2)
      , canvasY = Math.floor(Y)
      , canvasZ = parseInt(canvasX.toString().slice(0,2))
                + parseInt(canvasY.toString().slice(0,2))

    return this.hexColor = "#" + normalizeHex(canvasX) + normalizeHex(canvasY) + normalizeHex(canvasZ)
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
    value = value.toString()

    if (value.length === 1)
      return "0" + value

    else if (value.length === 3) {
      var value1 = value.slice(0,2)

      if (hexLetters[value1])
        value1 = hexLetters[value1]
      else
        value1 = "F"

      return value1 + value.slice(2,3)

    } else
      return value
  }

  ColorPlane.prototype.showColor = function() {
    this.context.fillStyle = this.hexColor
    this.context.fillRect(0,0, this.$canvas.scrollWidth, this.$canvas.scrollHeight)

    var elem = document.getElementById('colorplane-current-hex')
    elem.textContent = this.hexColor
    elem.style.color = this.hexColor
  }

  ColorPlane.prototype.saveCurrentColor = function() {
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent('change', false, true)
    this.$el.dispatchEvent(evt)

    var elem = document.getElementById('colorplane-selected-hex')
    elem.textContent = this.hexColor
    elem.style.color = this.hexColor

    document.getElementById('colorplane-selected-color').style.background = this.hexColor
    document.getElementById('colorplane-instructions').textContent = "Color selected!"
  }

  container.ColorPlane = ColorPlane
})(window)

document.addEventListener('DOMContentLoaded', function() {
  new ColorPlane()
})