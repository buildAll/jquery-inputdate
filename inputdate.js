(function(window,$,undefined){
  //==== Common Tool====
  function isValidInput(s){
    var input = s;
    input = $.trim(input);
    if(input.length==0||isNaN(input)){
      return false;
    }
    return true;
  }

  //====Define InputDate Class====
  function InputDate(el,opt){
    this.$el = $(el);
    this.options = opt;

    this.init();
  }

  InputDate.DEFAULTS = {};

  InputDate.prototype.init = function(){
    this.initHTML();
    this.yearEvent();
    this.monthEvent();
  }

  InputDate.prototype.initHTML = function(){
    this.$el.css('display','none');
    this.$tpl = $([
         '<div class="ccm-input-date">',
         '<input type="text" class="input-year" placeholder="yyyy"/><label>年</label>',
         '<input type="text" class="input-month"/><label>月</label>',
         '<input type="text" class="input-day"/><label>日</label>',
         '</div>'
    ].join(''));
    var dateInput = this.$tpl.find('input');
    this.year = dateInput.eq(0);
    this.month = dateInput.eq(1);
    this.day = dateInput.eq(2);

    dateInput.val('');

    this.month.attr('disabled','disabled')
    this.month.attr('placeholder','mm')

    this.day.attr('disabled','disabled')
    this.day.attr('placeholder','dd')

    this.$tpl.insertAfter(this.$el);

  }

  InputDate.prototype.yearEvent = function(){
    var that = this;
   // y.off('focusout').on('focusout',function(){
    this.$tpl.off('focusout','.input-year').on('focusout','.input-year',function(){
      var val = that.year.val();
      if(!isValidInput(val)){
        alert('pls input the number');
        that.year.val('');
        that.year.focus();
        return;
      }
      if(val.length!=4){
        alert("The year format should be yyyy, such as 2015");
        that.year.focus();
        return;
      }
        that.year.attr('disabled','disabled');
        that.month.removeAttr('disabled');
        that.year.focus();
     })
  }

  InputDate.prototype.monthEvent = function(){
    var that = this;
    this.$tpl.off('mouseover','.input-month').on('mouseover','.input-month',function(){
      var $this = $(this);
      if($this.attr('disabled')=='disabled'){
        $this.attr('placeholder','pls input the year first');
        return;
      }
    })
    this.$tpl.off('mouseleave','.input-month').on('mouseleave','.input-month',function(){
      var $this = $(this);
      if($this.attr('disabled')=='disabled'){
        $this.attr('placeholder','mm');
        return;
      }
    })
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
