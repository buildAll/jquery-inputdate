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

  InputDate.DEFAULTS = {
    format:'yyyy-mm-dd'
  };

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

  InputDate.prototype.validateYear = function(){
      var val = this.year.val();
      if(!isValidInput(val)){
        //alert('pls input a number');
        this.year.val('');
        //this.year.focus();
        return;
      }
      if(val.length!=4){
        //alert("The year format should be yyyy, such as 2015");
        this.year.val('');
        //this.year.focus();
        return;
      }
      this.year.attr('disabled','disabled');
      this.month.removeAttr('disabled');
      this.month.focus();
  }

  InputDate.prototype.yearEvent = function(){
    var that = this;
   // y.off('focusout').on('focusout',function(){
    this.$tpl.off('focusout','.input-year').on('focusout','.input-year',function(){
       that.validateYear();
    })

    this.$tpl.off('keyup','.input-year').on('keyup','.input-year',function(){
       if(that.month.attr('placeholder')!='mm'){
         that.month.attr('placeholder','mm');
       }
       if(that.year.val().length==4){
          that.validateYear();
       }
    })

  }

  InputDate.prototype.validateMonth = function(){
     var val = this.month.val();
     if(!isValidInput(val)){
       //alert('pls input a number');
       this.month.val('');
       //this.month.focus();
       return;
     }
     if(val.length>2){
      //alert("The month format should be mm, such as 07");
       this.month.val('');
       //this.month.focus();
       return;
     }

     //this.month.val(addLeadingZero(this.month.val()));
     if(val > 12){
       this.month.val('');
       //this.month.focus();
       return;
     }
     this.month.attr('disabled','disabled');
     this.day.removeAttr('disabled');
     this.day.focus();
     this.month.val(addLeadingZero(this.month.val()));
  }

  InputDate.prototype.monthEvent = function(){
    var that = this;
    this.$tpl.off('mouseover','.input-month').on('mouseover','.input-month',function(){
      var $this = $(this);
      if($this.attr('disabled')=='disabled'&& that.year.val()==''){
        that.year.focus();
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
      that.validateMonth();
    })

    this.$tpl.off('keyup','.input-month').on('keyup','.input-month',function(){
       if(that.day.attr('placeholder')!='dd'){
         that.day.attr('placeholder','dd');
       }
       if(that.month.val().length==2){
          that.validateMonth();
       }
    })


  }

  InputDate.prototype.validateDay = function(){
     var val = this.day.val();
     var maxDay = 0;
     if(!isValidInput(val)){
       //alert('pls input a number');
       this.day.val('');
       //this.day.focus();
       return;
     }
     if(val.length>2){
       //alert("The day format should be dd, such as 28");
       this.day.val('');
       //this.day.focus();
       return;
     }
    //addLeadingZero(this.day.val());
    this.day.val(addLeadingZero(this.day.val()));
    switch(this.month.val()){
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
       if(this.year.val()%4==0){
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
       this.day.val('');
       //this.day.focus();
       return;
     }

     this.day.attr('disabled','disabled');
     this.getDate();
  }

  InputDate.prototype.dayEvent = function(){
     var that = this;
     this.$tpl.off('mouseover','.input-day').on('mouseover','.input-day',function(){
       var $this = $(this);
       if($this.attr('disabled')=='disabled'&& that.year.val()==''){
         that.year.focus();
         $this.attr('placeholder','pls input the year first');
         return;
       }
       if($this.attr('disabled')=='disabled'&& that.month.val()==''){
         that.month.focus();
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
       if(that.day.val().length<=1){
        that.validateDay();
       }
     })
     this.$tpl.off('keyup','.input-day').on('keyup','.input-day',function(){
       if(that.day.val().length==2){
         that.validateDay();
       }
     })

  }

  InputDate.prototype.getDate = function(){
    var y = this.year.val();
    var m = this.month.val();
    var d = this.day.val();
    var date = y + '-' + m +'-' + d;
    switch(this.options.format){
      case 'yyyy/mm/dd':
        date = y + '/' + m + '/' + d;
      break;

      case 'dd/mm/yyyy':
        date = d + '/' + m + '/' + y;
      break;
    }
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
