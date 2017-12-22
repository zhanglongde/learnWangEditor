import $ from '../util/dom-core.js'

class ImgTool {
    constructor(editor) {
        this.editor = editor
    }
    
    show() {
        let editor = this.editor
        let ndTarget = editor._clickedImg
        this.ndTarget = editor._clickedImg
        let positionX = ndTarget.offsetLeft
        let positionY = ndTarget.offsetTop
        let originWidth = ndTarget.offsetWidth
        let originHeight = ndTarget.offsetHeight
        this.positionX = positionX
        this.positionY = positionY
        this.originX = positionX
        this.originY = positionY

        this.originWidth = originWidth
        this.originHeight = originHeight
        this.currentWidth = originWidth
        this.currentHeight = originHeight
        this.naturalWidth = ndTarget.naturalWidth
        this.naturalHeight = ndTarget.naturalHeight

        this.minWidth =  parseInt(this.naturalWidth * 0.4)
        this.minHeight =  parseInt(this.naturalHeight * 0.4)

        this.$imgDragContainer = $(`<div class="img-drag-container" style="left:${this.positionX}px; top:${this.positionY}px"></div>`)
        this.showImgWrapper()
        this.showToolbar()
        this.editor.$textContainerElem.append(this.$imgDragContainer)

        document.body.addEventListener('click', (event) => {
            let tag = event.target.tagName.toLowerCase()
            if (tag === 'img') {
                return
            }
            this.hide()
        }, true)
    }

    showImgWrapper () {
        this.$imgWrapper = $(`<div class="img-wrapper" style="height:${this.currentHeight}px;width:${this.currentWidth}px">
                <div class="img-mask"></div>
                <!--<span class="img-mask-corner-rect top left"></span>-->
                <!--<span class="img-mask-corner-rect top right"></span>-->
                <!--<span class="img-mask-corner-rect bottom left"></span>-->
            </div>`)
        this.showCornerRect()
        this.$imgDragContainer.append(this.$imgWrapper)
    }

    showCornerRect () {
        this.$bottomRight = $(`<span class="img-mask-corner-rect bottom right"></span>`)
        let startX = 0, startY = 0, flag = false, draggedRectTarget = null
        this.$bottomRight.on('mousedown', (event) => {
            draggedRectTarget = event.target
            startX = event.pageX
            startY = event.pageY
            flag = true
            // console.log(startX, startY)
        })
        $(document).on('mousemove', (event) => {
            if (!flag) {
                return
            }
            let currentX = event.pageX
            let currentY = event.pageY
            this.calCurrent({
                currentX,
                currentY,
                startX,
                startY,
                draggedRectTarget
            })
        })
        $(document).on('mouseup', (event) => {
            if (!flag) {
                return
            }
            let currentX = event.pageX
            let currentY = event.pageY
            this.calCurrent({
                currentX,
                currentY,
                startX,
                startY,
                draggedRectTarget
            })
            flag = false
            this.updateSize($(this.ndTarget), this.currentWidth, this.currentHeight)
            this.hide()
        })
        this.$imgWrapper.append(this.$bottomRight)
    }

    calCurrent ({currentX, currentY, startX, startY, draggedRectTarget}) {
        let scale = this.originHeight / this.originWidth
        let dX = currentX - startX
        let dY = currentY - startY
        dY = Math.abs(dX) * scale * Math.sign(dY)
        // console.log(dX, dY, currentX, currentY, scale)
        let dirTop = 1
        let dirLeft = 1
        let willPositionY = this.originY
        let willPositionX = this.originX
        if (draggedRectTarget.classList.contains('top')) {
            willPositionY = this.originY + dY
            dirTop = -1
        }
        if (draggedRectTarget.classList.contains('left')) {
            willPositionX = this.originX + dX
            dirLeft = -1
        }
        dX *= dirLeft
        dY *= dirTop
        if (Math.sign(dY) !== Math.sign(dX)) {
            return
        }
        let willW = this.originWidth + dX
        let willH = this.originHeight + dY
        if (willW < this.minWidth) {
            this.currentWidth = this.minWidth
        } else {
            this.currentWidth = willW
            this.positionX = willPositionX
        }
        if (willH < this.minHeight) {
            this.currentHeight = this.minHeight
        } else {
            this.currentHeight = willH
            this.positionY = willPositionY
        }
        // console.log('%c-----------------------------------------------------------', 'background-color:#85a;color:#fff;font-size:30px;')
        // console.log(this.currentWidth, this.currentHeight, this.positionX, this.positionY)
        this.updateStatus(this.currentWidth, this.currentHeight, this.positionX, this.positionY)
    }

    updateStatus (currentWidth, currentHeight, positionX, positionY) {
        this.$imgDragContainer.css('left', positionX + 'px')
        this.$imgDragContainer.css('top', positionY + 'px')
        this.$imgWrapper.css('width', currentWidth + 'px')
        this.$imgWrapper.css('height', currentHeight + 'px')
    }

    updateSize ($target, currentWidth, currentHeight) {
        $target.css('width', currentWidth + 'px')
        $target.css('height', currentHeight + 'px')
    }

    updatePosition ($target, positionX, positionY) {
        $target.css('left', positionX + 'px')
        $target.css('top', positionY + 'px')
    }

    showToolbar () {
        this.$toolbar = $(`<div class="toolbar"></div>`)
        let toolMinSize = $(`<a href="#">小尺寸</a>`)
        let toolBestSize = $(`<a href="#">最适合尺寸</a>`)
        let toolOriginSize = $(`<a href="#">原始尺寸</a>`)
        let toolRemove = $(`<a href="#">移除</a>`)
        toolMinSize.on('click', () => {
            this.updateSize($(this.ndTarget), this.minWidth, this.minHeight)
        })
        toolBestSize.on('click', () => {
            this.updateSize($(this.ndTarget), this.naturalWidth, this.naturalHeight)
        })
        toolOriginSize.on('click', () => {
            this.updateSize($(this.ndTarget), this.naturalWidth, this.naturalHeight)
        })
        toolRemove.on('click', () => {
            $(this.ndTarget).remove()
        })
        this.$toolbar.append(toolMinSize)
        this.$toolbar.append(toolBestSize)
        this.$toolbar.append(toolOriginSize)
        this.$toolbar.append(toolRemove)
        this.$imgDragContainer.append(this.$toolbar)
    }

    hide() {
        this.$imgDragContainer.remove()
    }
}

export default ImgTool