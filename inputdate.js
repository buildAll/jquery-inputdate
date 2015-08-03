'use strict';
(function(window,$,undefined){

  //==== Common Tool====
  function isValidInput(s){
    var input = s;
    input = $.trim(input);
    if(input.length==0||isNaN(input)||input<1){
      return false;
    }
    return true;
  }

  function addLeadingZero(s){
    var input = s;
    if(input.length == 1){
      input = '0'+ input;
    }
    return input;
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
    this.resetHTML();
    this.yearEvent();
    this.monthEvent();
    this.dayEvent();
  }

  InputDate.prototype.initHTML = function(){
    var tag = this.$el.get(0).tagName.toUpperCase();
    var classes = this.$el.get(0).className.split(' ');

    if(tag != 'INPUT'){
      throw new Error('the selector of inputdate plugin can only be <input> tag');
    }

    this.$el.css('display','none');
    this.$tpl = $([
         '<div class="ccm-input-date" style="min-width:250px;_width:250px">',
         '<input type="text" class="input-year" style="width:10%;text-align:right"  placeholder="yyyy"/><label>年</label>',
         '<input type="text" class="input-month" style="width:10%;text-align:right"/><label>月</label>',
         '<input type="text" class="input-day" style="width:10%;text-align:right"/><label>日</label>',
         '<button class="btn">清除</button>',
         '</div>'
    ].join(''));

    for(var i in classes){
     this.$tpl.addClass(classes[i]);
    }

    var dateInput = this.$tpl.find('input');
    this.year = dateInput.eq(0);
    this.month = dateInput.eq(1);
    this.day = dateInput.eq(2);
    this.button = this.$tpl.find('button.btn');
    dateInput.val('');

    this.month.attr('disabled','disabled')
    this.month.attr('placeholder','mm')

    this.day.attr('disabled','disabled')
    this.day.attr('placeholder','dd')

    this.$tpl.insertAfter(this.$el);
    this.button = this.$tpl.find('button.btn');

  }

  InputDate.prototype.resetHTML = function(){
    var that = this;
    this.button.off('click').on('click',function(e){
    //this.$tpl.off('click','button.btn').on('click','button.btn',function(){// need to figure it out why this line will make it affect all the inputs
      e.preventDefault();//The magic happend here, I should figure out why it will affect all the inputs without this line
      that.$el.val('');
      that.year.val('');
      that.month.val('');
      that.day.val('');
      that.year.focus();
      that.year.removeAttr('disabled');
      that.month.attr('disabled','disabled');
      that.month.attr('placeholder','mm');
      that.day.attr('disabled','disabled');
      that.day.attr('placeholder','dd');
    })
  }

  InputDate.prototype.yearEvent = function(){
    var that = this;
   // y.off('focusout').on('focusout',function(){
    this.$tpl.off('focusout','.input-year').on('focusout','.input-year',function(){
      var val = that.year.val();
      if(!isValidInput(val)){
        //alert('pls input a number');
        that.year.val('');
        that.year.focus();
        return;
      }
      if(val.length!=4){
        //alert("The year format should be yyyy, such as 2015");
        that.year.val('');
        that.year.focus();
        return;
      }
        that.year.attr('disabled','disabled');
        that.month.removeAttr('disabled');
        that.month.focus();
     })
  }

  InputDate.prototype.monthEvent = function(){
    var that = this;
    this.$tpl.off('mouseover','.input-month').on('mouseover','.input-month',function(){
      var $this = $(this);
      if($this.attr('disabled')=='disabled'&& that.year.val()==''){
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
    this.$tpl.off('focusout','.input-month').on('focusout','.input-month',function(){
      var val = that.month.val();
      if(!isValidInput(val)){
        //alert('pls input a number');
        that.month.val('');
        that.month.focus();
        return;
      }
      if(val.length>2){
       //alert("The month format should be mm, such as 07");
        that.month.val('');
        that.month.focus();
        return;
      }

      //that.month.val(addLeadingZero(that.month.val()));
      if(val > 12){
        that.month.val('');
        that.month.focus();
        return;
      }
      that.month.attr('disabled','disabled');
      that.day.removeAttr('disabled');
      that.day.focus();
      that.month.val(addLeadingZero(that.month.val()));
    })

  }

  InputDate.prototype.dayEvent = function(){
     var that = this;
     var maxDay = 0;
     this.$tpl.off('mouseover','.input-day').on('mouseover','.input-day',function(){
     var $this = $(this);
       if($this.attr('disabled')=='disabled'&& that.month.val()==''){
        $this.attr('placeholder','pls input the month first');
        return;
       }
      })
      this.$tpl.off('mouseleave','.input-day').on('mouseleave','.input-day',function(){
        var $this = $(this);
        if($this.attr('disabled')=='disabled'){
          $this.attr('placeholder','dd');
          return;
        }
      })
      this.$tpl.off('focusout','.input-day').on('focusout','.input-day',function(){
      var val = that.day.val();
      if(!isValidInput(val)){
        //alert('pls input a number');
        that.day.val('');
        that.day.focus();
        return;
      }
      if(val.length>2){
        //alert("The day format should be dd, such as 28");
        that.day.val('');
        that.day.focus();
        return;
      }
     //addLeadingZero(that.day.val());
     that.day.val(addLeadingZero(that.day.val()));
     switch(that.month.val()){
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
          maxDay = 31;
        break;

        case '02':
        if(that.year.val()%4==0){
          maxDay = 29;
        }else{
          maxDay = 28;
        }
        break;

        default:
        maxDay = 30;
        break;
      }

      if(val>maxDay){
        that.day.val('');
        that.day.focus();
        return;
      }

      that.day.attr('disabled','disabled');
      that.getDate();
    })

  }

  InputDate.prototype.getDate = function(){
    var date = this.year.val()+'-'+this.month.val()+'-'+this.day.val();
    console.log(date);
    this.$el.val(date);
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
