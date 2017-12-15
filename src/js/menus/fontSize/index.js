/*
    menu - header
*/
import $ from '../../util/dom-core.js'
import DropList from '../droplist.js'

// 构造函数
function FontSize(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 100,
        $title: $('<p>字体大小</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<h1>6</h1>'), value: '6' },
            { $elem: $('<h2>5</h2>'), value: '5' },
            { $elem: $('<h3>4</h3>'), value: '4' },
            { $elem: $('<h4>3</h4>'), value: '3' },
            { $elem: $('<h5>2</h5>'), value: '2' },
            { $elem: $('<p>1</p>'), value: '1' }
        ],
        onClick: (value) => {
            // 注意 this 是指向当前的 Head 对象
            this._command(value)
        }
    })
}

// 原型
FontSize.prototype = {
    constructor: FontSize,

    // 执行命令
    _command: function (value) {
        const editor = this.editor
        editor.cmd.do('FontSize', value)
    }
}

export default FontSize