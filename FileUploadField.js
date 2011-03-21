/*!
* Ext JS Library 3.0.2
* Copyright(c) 2006-2009 Ext JS, LLC
* licensing@extjs.com
* http://www.extjs.com/license
* Code has been modified from original found at: http://www.sencha.com/forum/showthread.php?83978
*/

Ext.ns('Ext.ux.form');

/**
* @class Ext.ux.form.FileUploadField
* @extends Ext.form.TextField
* Creates a file upload field.
* @xtype fileuploadfield
*/
Ext.ux.form.FileUploadField = Ext.extend(Ext.form.TextField, {
    /**
    * @cfg {String} buttonText The button text to display on the upload button (defaults to
    * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
    * value will be used instead if available.
    */
    buttonText: 'Browse...',
    /**
    * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
    * text field (defaults to false).  If true, all inherited TextField members will still be available.
    */
    buttonOnly: false,
    /**
    * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
    * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
    */
    buttonOffset: 3,
    /**
    * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
    */

    // private
    readOnly: true,

    /**
    * @hide
    * @method autoSize
    */
    autoSize: Ext.emptyFn,

    // private
    initComponent: function () {
        Ext.ux.form.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
        /**
        * @event fileselected
        * Fires when the underlying file input field's value has changed from the user
        * selecting a new file from the system file selection dialog.
        * @param {Ext.ux.form.FileUploadField} this
        * @param {String} value The file value returned by the underlying file input field
        */
            'fileselected'
        );
    },

    // private
    onRender: function (ct, position) {
        Ext.ux.form.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({ cls: 'x-form-field-wrap x-form-file-wrap' });

        // This causes odd button appearance, not sure of it's intent, removing...
//      this.wrap.on({
//          'mousemove': this.onButtonMouseMove,
//          'mouseover': this.onButtonMouseMove,
//          scope: this
//      });

        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');


        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        // Override button template to get consistent button appearance if a icon is used
        // This template explicitly adds style elements which should be applied by x-btn-text but are missing or ignored (cross browser issue)
        if (btnCfg.iconCls) {
            btnCfg.template = new Ext.Template(
                '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}" style="background-position: 0pt 2px; background-repeat: no-repeat; padding: 3px 0pt 2px 18px;">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                "</tr></tbody></table>"
            );
        }

        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn'  // http://www.extjs.com/forum/showthread.php?t=82344
        }));

        // Moved this here to guarantee the button has already been instantiated, this calls adds any tooltip and calls bindListeners.
        this.createFileInput();

        if (this.buttonOnly) {
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.resizeEl = this.positionEl = this.wrap;
    },

    bindListeners: function () {
        this.fileInput.on({
            scope: this,
            // Only IE supports mouseenter, replaced with mouseover
            mouseover: function () {
                this.button.addClass(['x-btn-over', 'x-btn-focus']);
            },
            // Only IE supports mouseleave, replaced with mouseout
            mouseout: function () {
                this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click']);
            },
            mousedown: function () {
                this.button.addClass('x-btn-click');
            },
            mouseup: function () {
                this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click']);
            },
            change: function () {
                var v = this.fileInput.dom.value;
                this.setValue(v);
                this.fireEvent('fileselected', this, v);
            }
        });
    },

    createFileInput: function () {
        this.fileInput = this.wrap.createChild({
            name: this.name || this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });

        if (this.button.tooltip) {
            if (Ext.isObject(this.button.tooltip)) {
                Ext.QuickTips.register(Ext.apply({
                    target: this.fileInput
                }, this.button.tooltip));
            } else {
                this.fileInput.dom[this.button.tooltipType] = this.button.tooltip;
            }
        }
        this.bindListeners();
    },

    reset: function () {
        this.fileInput.remove();
        this.createFileInput();
        this.bindListeners();
        Ext.ux.form.FileUploadField.superclass.reset.call(this);
    },

    // private
    getFileInputId: function () {
        return this.id + '-file';
    },

    // private
    onResize: function (w, h) {
        Ext.ux.form.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w);

        if (!this.buttonOnly) {
            this.el.setWidth(this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset);
        }
    },

    // private
    onDestroy: function () {
        Ext.ux.form.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },

    onDisable: function () {
        Ext.ux.form.FileUploadField.superclass.onDisable.call(this);
        this.doDisable(true);
    },

    onEnable: function () {
        Ext.ux.form.FileUploadField.superclass.onEnable.call(this);
        this.doDisable(false);

    },

    // private
    doDisable: function (disabled) {
        this.fileInput.dom.disabled = disabled;
        this.button.setDisabled(disabled);
    },

    // private
    preFocus: Ext.emptyFn,

    // private
    alignErrorIcon: function () {
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },

    /**
    * Handler when the cursor moves over the wrap.
    * The fileInput gets positioned to guarantee the cursor is over the "Browse" button.
    * @param {Event} e mouse event.
    * @private
    */
    onButtonMouseMove: function (e) {
        var right = this.wrap.getRight() - e.getPageX() - 10;
        var top = e.getPageY() - this.wrap.getY() - 10;
        this.fileInput.setRight(right);
        this.fileInput.setTop(top);
        this.button.addClass(['x-btn-over', 'x-btn-focus']);
    },

    /**
    * Detaches the input file associated with this FileUploadField so that it can be used for other purposes (e.g., uplaoding).
    * The returned input file has all listeners and tooltips that were applied to it by this class removed.
    * @param {Boolean} whether to create a new input file element for this BrowseButton after detaching.
    * True will prevent creation.  Defaults to false.
    * @return {Ext.Element} the detached input file element.
    */
    detachFileInput: function (noCreate) {
        var result = this.fileInput;

        if (Ext.isObject(this.button.tooltip)) {
            Ext.QuickTips.unregister(this.fileInput);
        } else {
            this.fileInput.dom[this.button.tooltipType] = null;
        }
        this.fileInput.removeAllListeners();
        this.fileInput = null;

        if (!noCreate) {
            this.createFileInput();
        }
        return result;
    },

    getName: function () {
        return this.name || ''; // uses name property instead of el.dom.name which has been deleted
    }

});

Ext.reg('fileuploadfield', Ext.ux.form.FileUploadField);

// backwards compat
Ext.form.FileUploadField = Ext.ux.form.FileUploadField;
