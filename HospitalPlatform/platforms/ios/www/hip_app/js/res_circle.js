
function res_circle(){
	this.res_x=0;
	this.res_y=0;
	this.res_obj=null;
	this.res_step=1;
	this.res_speed=1;
	this.res_pos=1;
	this.res_r=1;
	this.toMove=function(obj,speed,step,r){
		with(this){
			res_obj=obj;
			res_obj.style['transitionDuration']='0ms';
			res_x = parseInt(res_obj.style.top);
			res_y = parseInt(res_obj.style.left);
			res_obj.style.position = "absolute";
			res_speed = speed;
			res_step = step;
			res_r = r;
			toCircle();
		}
		
	};
	
	this.toCircle=function(){
		with(this){
			if(res_pos>1080)res_pos=1;
			var rad = res_pos*Math.PI/180;
			var x = res_r*Math.cos(rad);
			var y = res_r*Math.sin(rad);
			//res_obj.style.top = x+"px";
			//res_obj.style.left = y+"px";
			res_obj.style['transform']="translate3d("+x+"px,"+y+"px,0px)";
			res_obj.style['-webkit-transform']="translate3d("+x+"px,"+y+"px,0px)";
			res_pos+=res_step;
			var _this = this;
			window.setTimeout(function(){
				_this.toCircle();
			},res_speed)
		}	
	};
	this.drawCircle=function(width,length,objs){
		with(this){
			var x = width/2;
			var y = length/2;
			var r = x>y?y*0.3:x*0.3;
			var num = objs.length;
			var step = 360/num;
			for(var i=1;i<=num;i++){
				var rad = i*step*Math.PI/180;
				objs[i-1].style.position = "relative";
				objs[i-1].style.top = r*Math.cos(rad)+x;
				objs[i-1].style.left = r*Math.sin(rad)+y;
				var o = new res_circle();
				o.toMove(objs[i-1],10*i,0.1+i*0.3,10+i*3);
			}		
		}
		
	};
	
}