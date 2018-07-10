import {Injectable} from '@angular/core';

/*
  Generated class for the FlyCartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FlyCartProvider{
  public div: HTMLDivElement;
  constructor() {
  }
  // 飞底部效果
  fly(e, el, renderer) {
    let parentEl = el.nativeElement.offsetParent.offsetParent.offsetParent;
    if (this.div) {
      let divEles = parentEl.querySelectorAll('.createHoverDiv');
      if (divEles.length > 5) {
        renderer.removeChild(parentEl,divEles[0]);
        for (let k in divEles.length) {
          renderer.removeChild(parentEl,divEles[k]);
        }
      }
    }
    let
      left = e.clientX - 5,
      top = e.pageY - 13,
      endLeft = 25,
      endTop =  e.view.innerHeight - 30;
    this.div = renderer.createElement('div');
    renderer.appendChild(parentEl,this.div);
    renderer.addClass(this.div, 'createHoverDiv');
    renderer.setStyle(this.div,'top',top + "px");
    renderer.setStyle(this.div,'left',left + 'px');
    setTimeout(()=> {
      renderer.setStyle(this.div,'left',endLeft + "px");
      renderer.setStyle(this.div,'top',endTop+"px");
      renderer.setStyle(this.div,'background-color','transparent');
    },0);
  }
  // 飞头部效果
  // flyTop(e, el, renderer) {
  //   if (this.div) {
  //     let divEles = el.nativeElement.parentElement.querySelectorAll('div.createHoverDiv');
  //     if (divEles.length > 5) {
  //       renderer.removeChild(el.nativeElement.offsetParent,divEles[0]);
  //     }
  //   }
  //   console.log(e)
  //   let left = e.clientX - 5,
  //     top = e.pageY-10,
  //     endLeft = e.view.innerWidth - 30,
  //     endTop = top - e.clientY;
  //   this.div = renderer.createElement('div');
  //   renderer.appendChild(el.nativeElement.offsetParent.offsetParent.offsetParent,this.div);
  //   renderer.addClass(this.div, 'createHoverDiv');
  //   renderer.setStyle(this.div,'top',top + "px");
  //   renderer.setStyle(this.div,'left',left + 'px');
  //   setTimeout(()=> {
  //     renderer.setStyle(this.div,'left',endLeft + "px");
  //     renderer.setStyle(this.div,'top',endTop+"px");
  //     renderer.setStyle(this.div,'background-color','transparent');
  //   },0);
  // }
}
