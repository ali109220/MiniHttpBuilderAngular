import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HtmlEditorService, ImageService, LinkService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-html-document-view',
  templateUrl: './html-document-view.component.html',
  styleUrls: ['./html-document-view.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, MessageService]
})
export class HtmlDocumentViewComponent implements OnInit {
  htmlElements:any[] = [];
  fileName:string="Sample";
  currentElementId = "";
  currentElementType = "";
  typeOfShow = 'none';
  marginTop:number=0;
  marginLeft:number=0;
  marginBottom:number=0;
  marginRight:number=0;
  imageWidth:number=0;
  imageHeight:number=0;
  imageSrc: string = "";
  controlAlignment:string = "";
  cBackgroundValue: string = '';
  buttonText: string = "";
  buttonLink: string = "";
  buttonType: any;
  buttonWidth: number = 0;
  buttonHeight: number = 0;
  cFontColor: string = "";
  cButtonColor: string = "";
  fontSize: number = 0;
  
  @Output() onClose = new EventEmitter<any>();
  @Input() docId: any;
  public fontFamily: Object = {
    default: "Noto Sans", // to define default font-family
    items: [
      {text: "Segoe UI", value: "Segoe UI", class: "e-segoe-ui",  command: "Font", subCommand: "FontName"},
      {text: "Noto Sans", value: "Noto Sans",  command: "Font", subCommand: "FontName"},
      {text: "Impact", value: "Impact,Charcoal,sans-serif", class: "e-impact", command: "Font", subCommand: "FontName"},
      {text: "Tahoma", value: "Tahoma,Geneva,sans-serif", class: "e-tahoma", command: "Font", subCommand: "FontName"},
    ]
  };
  controls: any[] = [
    {id:'TextId', name:'Text', title:'Text', icon:'text_format'},
    {id:'TextId', name:'Text', title:'Text', icon:'text_format'},
    {id:'ImageId', name:'Image', title:'Image', icon:'image'},
  ];
  theHtmlString: string = "";
  buttonTypes: any[] = [];
  loginButtonShow: boolean = false;
  loading: boolean = false;
  constructor(private router: Router ,private _sharedService: SharedService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentElementId = '';
    this.loading = true;
    this.buttonTypes = [
      {name: 'Button', id: 'button'},
      {name: 'Submit', id: 'submit'},
      {name: 'Reset', id: 'reset'},
      {name: 'Link', id: 'link'}
    ];
      if(this.docId != 0)
        this.getDoc();
      else
        this.loading = false;
    }
  getDoc() {
        this._sharedService.getDocumentForUpdate(this.docId).subscribe((res:any) => {
        this.htmlElements = res.data.htmlControls;
        this.fileName = res.data.name;
        
        setTimeout(()=>{                           //<<<---using ()=> syntax
          this.handleStylesofHtmlControls();
     }, 1000);
      }, (err:any) => {
        this.loading = false;
        if(err.status == 401){
          this.loginButtonShow = true;
          this.messageService.add({severity:'error', summary: 'Unauthorized', detail: 'You should login again because your session has finished'});
          this.router.navigate(['/login']);
        }
      });
    }
  handleStylesofHtmlControls() {
    debugger;
    for (let index = 0; index < this.htmlElements.length; index++) {
      this.currentElementId = this.htmlElements[index].elementId;
      if(this.htmlElements[index].type == "image")
        this.initImage(index);
      else if(this.htmlElements[index].elementType == "button")
        this.initButton(index);
      else this.initTextParagraph(index);
    }
    this.loading = false;
  }
  onClickCancelFile(e:any){
    this.onClose.emit(null);
  }
  onClickExportFile(e:any){
    var htmlCode = `<html>
    <head>
    </head>
    <body>
    <div>`;
    for (let index = 0; index < this.htmlElements.length; index++) {
      const elementId = this.htmlElements[index].elementId;
      var eleHtml = document.getElementById(elementId)?.innerHTML;
      htmlCode += eleHtml;
    }
    htmlCode+= `</div>
    </body></html>`;
    this.download(htmlCode);
    console.log(htmlCode);
  }
  onClickRemove(e:any){
    this.htmlElements = this.htmlElements.filter(x=> x.elementId != this.currentElementId);
    this.currentElementId = '';
  }
  download(content:any):void{
    content = content.replace(/\n/g, "");
    content = content.replace(/"/g, "'");
    content = content.replace(/\x3C!--bindings={  'ng-reflect-ng-if': 'true'}-->/g,"");
    content = content.replace(/\x3C!--bindings={  'ng-reflect-ng-if': 'false'}-->/g,"");
    content = content.replace(/_ngcontent-uva-c141=''/g,"");
    var path = this.fileName + '.html';
    var contentType = "application/octet-stream";
    var object = {htmlContent:content};
    const blob = new Blob([content], { type: contentType }); // you can change the type
      const url= window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = path;
      anchor.href = url;
      anchor.click();
      window.URL.revokeObjectURL(url);
  }
  onClickSaveFile(e:any){
    for (let index = 0; index < this.htmlElements.length; index++) {
      this.htmlElements[index].elementOrder = index +1 ;
    }
     var object = {
      id: 0,
      name: this.fileName,
      htmlControls: this.htmlElements
    };
    if(this.docId != 0){
      object.id = this.docId;
      this._sharedService.updateHtmlDocument(object).subscribe((res:any) => {
        console.log(res.status)
      },
      (err:any) => {
        if(err.status == 401){
          this.loginButtonShow = true;
          this.messageService.add({severity:'error', summary: 'Unauthorized', detail: 'You should login again because your session has finished'});
        }
      })
    }
    else{
      this._sharedService.addNewHtmlDocument(object).subscribe((res:any) => {
        this.docId = res.data;
    },
    (err:any) => {
      if(err.status == 401){
        this.loginButtonShow = true;
        this.messageService.add({severity:'error', summary: 'Unauthorized', detail: 'You should login again because your session has finished'});
      }
    })
    }
    
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.htmlElements, event.previousIndex, event.currentIndex);
  }
  onChangeTextEditor(e:any){
    var style = e.event.target.getAttribute('style');
    var contentHtml = e.event.target.getInnerHTML();
    this.htmlElements.find(x=> x.elementId == this.currentElementId).htmlText = contentHtml;
 }
 clickdragEle(e:any){
   debugger;
   var oldEle = this.currentElementId;
   this.currentElementId = e.currentTarget.id;
   
   this.marginLeft= this.htmlElements.find(x=> x.elementId == this.currentElementId).marginLeft.split('p')[0];
   this.marginBottom= this.htmlElements.find(x=> x.elementId == this.currentElementId).marginBottom.split('p')[0];;
   this.marginRight= this.htmlElements.find(x=> x.elementId == this.currentElementId).marginRight.split('p')[0];;
   this.marginTop= this.htmlElements.find(x=> x.elementId == this.currentElementId).marginTop.split('p')[0];;
   this.theHtmlString = e.currentTarget.classList['value'].includes("text-paragraph") ? 
   this.htmlElements.find(x=> x.elementId == this.currentElementId).htmlText : '';
   
   // this.controlAlignment = e.currentTarget.classList['value'].includes("image-section") ? 
   // this.htmlElements.find(x=> x.id == this.currentElementId).align : 'left';
   // this.controlAlignment = e.currentTarget.classList['value'].includes("image-section") ? 
   // this.htmlElements.find(x=> x.id == this.currentElementId).align : 'left';

   if(e.currentTarget.classList['value'].includes("text-paragraph")){
     this.currentElementType = 'text';
     this.typeOfShow = 'text';
   }
   else if(e.currentTarget.classList['value'].includes("image")){
     this.currentElementType = 'image';
     this.typeOfShow = 'prop';
   }
   else{
     this.currentElementType = 'button';
     this.typeOfShow = 'prop';
   }
   this.initConfigValues(e);
 }
  initConfigValues(e:any) {
    if(this.currentElementType == "image" || this.currentElementType == "button"){
      var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
      var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>)
      this.controlAlignment = children[0].style.marginRight == 'auto' && children[0].style.marginLeft == 'auto' ?
      "center" : children[0].style.marginLeft == 'auto' ? 'right' : 'left';
      
     this.cBackgroundValue = divchildren[0].style.backgroundColor;
      if(this.currentElementType == "image"){
        this.imageSrc = this.htmlElements.find(x=> x.elementId == this.currentElementId).link;
        this.imageWidth = this.htmlElements.find(x=> x.elementId == this.currentElementId).width;
        this.imageHeight = this.htmlElements.find(x=> x.elementId == this.currentElementId).height;
      }
      else{
        this.buttonType= this.htmlElements.find(x=> x.elementId == this.currentElementId).buttonType;
        this.buttonText = this.htmlElements.find(x=> x.elementId == this.currentElementId).text;
        this.buttonLink =this.htmlElements.find(x=> x.elementId == this.currentElementId).link;
       
       this.buttonWidth = parseInt(children[0].style.width);
       this.buttonHeight = parseInt(children[0].style.height);
       this.fontSize = parseInt(children[0].style.fontSize);
       this.cButtonColor = children[0].style.backgroundColor;
       this.cFontColor = children[0].style.color;
      }
    }
    
  }
 onClickTextDragEle(e:any){
   this.theHtmlString = '';
   var elesOfTextParagraph = Array.from(document.getElementsByClassName('text-paragraph') as HTMLCollectionOf<HTMLElement>);
   var lastorder = this.htmlElements.length;
   this.htmlElements.push({
     elementId: 'text-paragraph-' + (elesOfTextParagraph.length + 1).toString(),
     htmlText: `
     <h1> Lorem Ipsum </h1>
     <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
     elementType: 'text',
     elementOrder: (lastorder + 1).toString(),
     text: '',
     link: '',
     buttonType: '',
     align:'',
     backgroundColor:'',
     fontColor:'',
     buttonColor:'',
     fontSize:'',
     marginLeft:'0',
     marginRight:'0',
     marginTop:'0',
     marginBottom:'0',
     width:'0',
     height:'0',
     widthInPX:'0px',
     heightInPX:'0px'
   });
   
   this.currentElementId = 'image-section-' + (elesOfTextParagraph.length +1 ).toString();
   setTimeout(()=>{   
    this.initTextParagraph();
   }, 1000);
 }
 onClickImageDragEle(e:any){
   this.imageSrc = 'assets/imgs/defaultImg.png';
   this.imageWidth=400;
   this.imageHeight=400;
   this.controlAlignment = 'left';
   this.cBackgroundValue = 'white';
   var elesOfimages = Array.from(document.getElementsByClassName('image-section') as HTMLCollectionOf<HTMLElement>);
   var lastorder = this.htmlElements.length;
   this.htmlElements.push({
    elementId: 'image-section-' + (elesOfimages.length + 1).toString(),
     htmlText: '',
     elementType: 'image',
     elementOrder: (lastorder + 1).toString(),
     text: '',
     link: 'assets/imgs/defaultImg.png',
     buttonType: '',
     width:'400',
     height:'400',
     align:'left',
     backgroundColor:'white',
     fontColor:'',
     buttonColor:'',
     fontSize:'',
     marginLeft:'0',
     marginRight:'0',
     marginTop:'0',
     marginBottom:'0',
     widthInPX:'400px',
     heightInPX:'400px'
   });
   this.currentElementId = 'image-section-' + (elesOfimages.length +1 ).toString();
   setTimeout(()=>{   
    this.initImage();
   }, 1000);
 }
 onClickButtonDragEle(e:any){
   this.buttonText = 'Click Me';
   this.buttonLink = '';
   this.buttonWidth=150;
   this.buttonHeight=50;
   this.controlAlignment = 'left';
   this.cBackgroundValue = 'white';
   this.cFontColor = 'white';
   this.fontSize = 14;
   this.cButtonColor = '#2a2fb9';
   var elesOfButtons = Array.from(document.getElementsByClassName('button-section') as HTMLCollectionOf<HTMLElement>);
   var lastorder = this.htmlElements.length;
   this.htmlElements.push({
    elementId: 'button-section-' + (elesOfButtons.length + 1).toString(),
     htmlText: '',
     elementType: 'button',
     elementOrder: (lastorder + 1).toString(),
     text: 'Click Me',
     link: '',
     buttonType: 'button',
     width:'150',
     height:'50',
     widthInPX:'150px',
     heightInPX:'50px',
     align:'center',
     backgroundColor:'white',
     fontColor:'white',
     buttonColor:'#2a2fb9',
     fontSize:'14px',
     marginLeft:'10px',
     marginRight:'10px',
     marginTop:'10px',
     marginBottom:'10px'
   });
   this.currentElementId = 'button-section-' + (elesOfButtons.length + 1).toString();
   
   setTimeout(()=>{   
    this.initButton();
   }, 1000);
 }
 initTextParagraph(index:number = -1) {
  if(index != -1) this.initMargins(index);
}
 initMargins(index:number = -1) {
  this.onChangeMarginLeft(null, index);
  this.onChangeMarginRight(null, index);
  this.onChangeMarginBottom(null, index);
  this.onChangeMarginTop(null, index);
}
 initButton(index:number = -1) {
  if(index != -1) this.initMargins(index);
  this.onChangeButtonUrl(null);
   this.onhangeControlAlignemt(null, index);
   this.onhangeButtonSize(null, index);
   this.onSelectFontColor(null, index);
   this.onSelectBackgroundColor(null, index);
   this.onSelectButtonColor(null, index);
   this.onhangeButtonWidth(null, index);
   this.onhangeButtonHeight(null, index);
 }
 initImage(index:number = -1) {
   this.onChangeImgUrl(null);
   this.onChangeImageHeight(null);
   this.onhangeImageWidth(null);
   this.onhangeControlAlignemt(null, index);
   this.onSelectBackgroundColor(null, index);
   if(index != -1) this.initMargins(index);
 }
 onChangeMarginLeft(e:any, index:number = -1){
   var children = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   if(index != -1){
    children[0].style.marginLeft = this.htmlElements[index].marginLeft;
   }
   else{
    children[0].style.marginLeft = e.target.value + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).marginLeft = e.target.value + 'px';
   }
 }
 onChangeMarginRight(e:any, index:number = -1){
   var children = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   if(index != -1){
    children[0].style.marginRight = this.htmlElements[index].marginRight;
   }
   else{
    children[0].style.marginRight = e.target.value + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).marginRight = e.target.value + 'px';
   }
 }
 onChangeButtonType(e:any){
  this.htmlElements.find(x=> x.elementId == this.currentElementId).buttonType = this.buttonType;setTimeout(()=>{   
    this.initButton();
   }, 1000);
 }
 onChangeMarginBottom(e:any, index:number = -1){
   var children = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   if(index != -1){
    children[0].style.marginBottom = this.htmlElements[index].marginBottom;
   }
   else{
    children[0].style.marginBottom = e.target.value + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).marginBottom = e.target.value + 'px';
   }
 }
 onChangeMarginTop(e:any, index:number = -1){
   var children = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   if(index != -1){
    children[0].style.marginTop = this.htmlElements[index].marginTop;
   }
   else{
    children[0].style.marginTop = e.target.value + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).marginTop = e.target.value + 'px';
   }
 }
 buttonLinkListener(e:any){
   window.location.href = this.buttonLink;
 }
 onChangeButtonText(e:any){
   this.htmlElements.find(x=> x.elementId == this.currentElementId).text = this.buttonText;
 }
 onChangeButtonUrl(e:any){
   this.htmlElements.find(x=> x.elementId == this.currentElementId).link = this.buttonLink;
 }
 
 onhangeButtonWidth(e:any, index:number = -1){
   debugger;
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>);
   if(index != -1){
    children[0].style.width = this.htmlElements[index].widthInPX;
   }
   else{
    children[0].style.width = this.buttonWidth + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).width = this.buttonWidth.toString();
    this.htmlElements.find(x=> x.elementId == this.currentElementId).widthInPX = this.buttonWidth+ 'px';
   }
 }
 onhangeButtonHeight(e:any, index:number = -1){
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>);
   if(index != -1){
    children[0].style.height = this.htmlElements[index].heightInPX;
   }
   else{
    children[0].style.height = this.buttonHeight + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).height = this.buttonHeight.toString();
    this.htmlElements.find(x=> x.elementId == this.currentElementId).heightInPX = this.buttonHeight+ 'px';
   }
 }
 onhangeButtonSize(e:any, index:number = -1){
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>);
   if(index != -1){
    children[0].style.fontSize = this.htmlElements[index].fontSize;
   }
   else{
    children[0].style.fontSize = this.fontSize + 'px';
    this.htmlElements.find(x=> x.elementId == this.currentElementId).fontSize = this.fontSize+ 'px';
   }
 }
 onSelectButtonColor(e:any, index:number = -1){
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>);
   if(index != -1){
    children[0].style.backgroundColor = this.htmlElements[index].buttonColor;
   }
   else{
    children[0].style.backgroundColor = this.cButtonColor;
    this.htmlElements.find(x=> x.elementId == this.currentElementId).buttonColor =  this.cButtonColor;
   }
 }
 onSelectFontColor(e:any, index:number = -1){
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>);
   if(index != -1){
    children[0].style.color = this.htmlElements[index].fontColor;
   }
   else{
    children[0].style.color = this.cFontColor;
    this.htmlElements.find(x=> x.elementId == this.currentElementId).fontColor =  this.cFontColor;
   }
 }
 onChangeImgUrl(e:any){
   this.htmlElements.find(x=> x.elementId == this.currentElementId).link = this.imageSrc;
 }
 onhangeControlAlignemt(e:any, index:number = -1){
   var divchildren = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   var children = Array.from(divchildren[0].children as HTMLCollectionOf<HTMLElement>)
   var controlalign = index == -1 ? this.controlAlignment : this.htmlElements[index].align;
   children[0].style.display = 'block';
   children[0].style.marginLeft = '0';
   children[0].style.marginRight = '0';
   if(controlalign == 'left'){
     children[0].style.marginRight = 'auto';
   }
   else if(controlalign == 'right'){
     children[0].style.marginLeft = 'auto';
   }
   else{
     children[0].style.marginRight = 'auto';
     children[0].style.marginLeft = 'auto';
   }
   this.htmlElements.find(x=> x.elementId == this.currentElementId).align = this.controlAlignment;
 }
 onhangeImageWidth(e:any){
   this.htmlElements.find(x=> x.elementId == this.currentElementId).width = this.imageWidth.toString();
 }
 onChangeImageHeight(e:any){
   this.htmlElements.find(x=> x.elementId == this.currentElementId).height = this.imageHeight.toString();
 }
 onSelectBackgroundColor(e:any, index:number = -1){
   var children = Array.from(document.getElementById(this.currentElementId)?.children as HTMLCollectionOf<HTMLElement>)
   if(index != -1){
    children[0].style.backgroundColor = this.htmlElements[index].backgroundColor;
   }
   else{
    children[0].style.backgroundColor = this.cBackgroundValue;
    this.htmlElements.find(x=> x.elementId == this.currentElementId).backgroundColor =  this.cBackgroundValue;
   }
 }
 
 formatLabelOfSlider(value: number) {
   return value + 'px';
 }
public cssClass: String = "customClass";

 public tools: object = {
   items: ['Undo', 'Redo', '|','Bold', 'Italic',
       '|', 'Underline', 'StrikeThrough', '|',
       'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
       'LowerCase', 'UpperCase', '|',
       'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'FullScreen']
};

}
