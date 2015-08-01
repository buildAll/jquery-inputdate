(function(window,$,undefined){

  function InputDate(el,opt){
    this.$el = $(el);
    this.options = opt;

    this.init();
  }

  InputDate.DEFAULTS = {};

  InputDate.prototype.init = function(){
    this.$el.css('display','none');
    this.$tpl = $([
         '<div class="ccm-input-date">',
         '<input type="text" class="input-year"/><label>年</label>',
         '<input type="text" class="input-month"/><label>月</label>',
         '<input type="text" class="input-day"/><label>日</label>',
         '</div>'
    ].join(''));
    //this.$el.after(this.$tpl.html());
    var dateInput = this.$tpl.find('input');
    var y = dateInput.eq(0);
    var m = dateInput.eq(1);
    var d = dateInput.eq(2);

    dateInput.val('');

    m.attr('disabled','disabled')
    m.attr('placeholder','input the year first...')

    d.attr('disabled','disabled')
    d.attr('placeholder','input the year first...')

    this.$tpl.insertAfter(this.$el);
    y.off('focusout').on('focusout',function(){
   //this.$tpl.off('focusout','.input-year').on('focusout','.input-year',function(){
     console.log('hello');
     var val = y.val();
     if(val.length==0 || isNaN(val)){
       alert('pls input the number');
       y.val('');
       y.foucs();
       return;
     }
     y.attr('disabled','disabled');
     m.removeAttr('disabled');
     m.focus();
    })
    //this.$el.after(this.$tpl.html());
  }

  $.fn.inputDate = function(options){
   var defaults = {};
   var settings = $.extend( {}, InputDate.DEFAULTS, options );
   return this.each(function(){
     var $this = $(this),
         data = $this.data('input.date');
         if(!data){
            $this.data('input.date',(data=new InputDate(this, settings)));
         }
         return this;
   });
  }
})(window, jQuery);
