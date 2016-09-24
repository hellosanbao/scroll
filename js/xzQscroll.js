 ;(function($){
var xzQscroll=(function(){
    function xzQscroll(ele,options){
        this.settings=$.extend(true, $.fn.xzQscroll.options, options||{});
        this.win=ele
        this.init();
    }
    xzQscroll.prototype={
        init:function(){
           this.resetDom();
           this.countLayout();
           this.mouseEvent();
           this.curabs=0;
        },

        resetDom:function(){
          this.scrollBar=$('<div class="scroll-bar">');
          this.scrollBtn=$('<div class="scroll-btn">');
          this.win.addClass('scroll-content');
          this.warp=this.win.find(".scroll-warp")
          if(this.settings.hoverShow==true){
            this.win.addClass("hoverShow")
          }
          if(this.settings.dir=="y"){
            if(this.getContentDate()._wh>this.getContentDate()._ch){
                this.win.append(this.scrollBar.addClass('horizontal'));
                this.scrollBar.append(this.scrollBtn);
            }
          }else if(this.settings.dir=="x"){
            if(this.getContentDate()._ww>this.getContentDate()._cw){
                this.win.append(this.scrollBar.addClass('vertical'));
                this.scrollBar.append(this.scrollBtn);
            }
          }
        },

        countLayout:function(){
            this.ratioY=this.getContentDate()._ch/this.getContentDate()._wh;
            this.ratioX=this.getContentDate()._cw/this.getContentDate()._ww;
            if(this.settings.dir=="y"){
                this.scrollbtnHeight=(this.ratioY)*this.getContentDate()._ch;
                this.scrollBtn.height(this.scrollbtnHeight);
            } else if(this.settings.dir=="x"){
                this.scrollbtnWidth=(this.ratioX)*this.getContentDate()._cw;
                this.scrollBtn.width(this.scrollbtnWidth);
            }
        },

        mouseEvent:function(){
            var _this_=this;
            var dir=_this_.settings.dir;
            this.scrollBtn.on('mousedown.scroll',function(event){
                event.preventDefault(); 
                if(dir=='y'){
                    var startClient=event.pageY;
                    var offClient=parseInt(_this_.scrollBtn.css("top"));
                    _this_.compair=_this_.getContentDate()._ch-_this_.scrollbtnHeight;
                }else if(dir=='x'){
                    var startClient=event.pageX;
                    var offClient=parseInt(_this_.scrollBtn.css("left"));
                    _this_.compair=_this_.getContentDate()._cw-_this_.scrollbtnWidth;
                }
                 
                $(document).on('mousemove.scroll',function(event){
                    event.preventDefault();
                    var moveClient= dir=="y"?event.pageY-startClient+offClient:event.pageX-startClient+offClient;
                    if(moveClient<=0){
                        moveClient=0
                    }else if(moveClient>=_this_.compair){
                        moveClient=_this_.compair;
                    }
                    if(dir=='y'){
                        _this_.scrollBtn.css("top",moveClient+"px");
                        _this_.warp.css("top",(-moveClient/_this_.ratioY)+"px");  
                    }else if(dir=='x'){
                        _this_.scrollBtn.css("left",moveClient+"px");
                        _this_.warp.css("left",(-moveClient/_this_.ratioX)+"px");  
                    }
                    
                }).on('mouseup.scroll',function(){
                    _this_.curabs=-parseInt(_this_.warp.css("top"));
                    $(document).off('.scroll')
                 
           })
           })
            if(this.settings.mousewheelcontrol==true & dir=='y')
                this.mouseWheelEvent();
        },

        mouseWheelEvent:function(){
            var _this_=this
            this.win.on('mousewheel DOMMouseScroll',function(event){
                event.preventDefault();
                var $e=event.originalEvent;
                var delta=$e.wheelDelta?-$e.wheelDelta:$e.detail;
                if(delta>0){
                    _this_.curabs+=_this_.settings.mousewheelspeed
                    _this_.curabs=_this_.curabs>=_this_.getContentDate()._wh-_this_.getContentDate()._ch?_this_.getContentDate()._wh-_this_.getContentDate()._ch:_this_.curabs;
                }else{
                    _this_.curabs-=_this_.settings.mousewheelspeed;
                    _this_.curabs=_this_.curabs<=0?0:_this_.curabs;
                }
                _this_.scrollBtn.css("top",(_this_.curabs*_this_.ratioY)+"px");
                _this_.warp.css("top",-_this_.curabs+"px");    
            })
        },

        getContentDate:function(){
            this.contentWidth=this.win.width();
            this.contentHeight=this.win.height();
            this.warpWidth=this.warp.width();
            this.warpHeight=this.warp.height();
            return {
                _cw:this.contentWidth,
                _ch:this.contentHeight,
                _ww:this.warpWidth,
                _wh:this.warpHeight,
            }
        }

    }
    return xzQscroll;
}())
$.fn.xzQscroll=function(options){
    return this.each(function() {
        var self=$(this);
        insetance=self.data('xzQscroll');
        if(!insetance){
            self.data('xzQscroll',insetance=new xzQscroll(self,options));
        }
    });
}

$.fn.xzQscroll.options={
              dir:'y',
     scrollbarCss:null,
     scrollbtnCss:null,
        hoverShow:false,
mousewheelcontrol:true,
  mousewheelspeed:5,
}


}(jQuery))





