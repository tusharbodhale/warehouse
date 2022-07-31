import { Component, OnInit } from '@angular/core';
import { fabric } from "fabric";
import { FormGroup, FormBuilder,FormArray } from '@angular/forms';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'warehouse';
  screenHeight: number;
    screenWidth: number;

  canvas;
  buildZone;
  wrapper;
  paddingShift;
  imgInstance;
  fixFloorplan;
  markedFloorplan;

  biscuitTag;
  soapTag;
  chipsTag;
  shampooTag;

  skuCapacity=[0,0,0,0];

  skuHeight;
  skuWidth;
  skuLength;
  skuVolume;

  siteWidth;
  siteHeight;

  units;
  feets;

  jsonOutput;
  skuData;

  wareHouseForm: FormGroup;
  
  constructor(private fb: FormBuilder) { 
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
          console.log(this.screenHeight, this.screenWidth);
    }

  ngOnInit(){

    /* Initiate the form structure */
    this.wareHouseForm = this.fb.group({
      units:'1000',
      sku: this.fb.array([
      this.fb.group({length:'', height:'', width:''}),
      this.fb.group({length:'', height:'', width:''}),
      this.fb.group({length:'', height:'', width:''}),
      this.fb.group({length:'', height:'', width:''})]),
      invoice: this.fb.array([
        this.fb.group({quantity:''}),
        this.fb.group({quantity:''}),
        this.fb.group({quantity:''}),
        this.fb.group({quantity:''}),
      ])
    })

    this.intitialize();
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
    // Clear canvas - Delete shapes

    document.getElementById('clear').addEventListener('click', () => {
      !this.deleteActiveObjects() && this.canvas.clear();
    });

    document.addEventListener('keydown', (event) => {
      event.keyCode === 46 && this.deleteActiveObjects();
    })

    // SHAPES CREATION  ―――――――――――――――――――――――――

    let strokeWidth = 2;
    let strokeColor = '#43c8bf';

    // Square

    document.getElementById('biscuit').addEventListener('click', () => {
      this.biscuitTag = new fabric.Rect({
        strokeWidth: strokeWidth,
        stroke: strokeColor,
        fill: '#43c8bf',
        width: 50,
        height: 50,
        left: 100,
        top: 100
      });
      this.canvas.add(this.biscuitTag);
      // biscuit.bringForward();
      this.canvas.renderAll();
    });

    // Circle

    document.getElementById('shampoo').addEventListener('click', () => {
      this.shampooTag = new fabric.Rect({
        strokeWidth: strokeWidth,
        stroke: strokeColor,
        fill: '#896bc8',
        width: 50,
        height: 50,
        left: 100,
        top: 100
      })
      this.canvas.add(this.shampooTag);
    });

    // Triangle

    document.getElementById('soap').addEventListener('click', () => {
      this.soapTag = new fabric.Rect({
        strokeWidth: strokeWidth,
        stroke: strokeColor,
        fill: '#e54f6b',
        width: 50,
        height: 50,
        left: 100,
        top: 100
      })
      this.canvas.add(this.soapTag);
    });
    document.getElementById('chips').addEventListener('click', () => {
      this.chipsTag = new fabric.Rect({
        strokeWidth: strokeWidth,
        stroke: strokeColor,
        fill: '#ffff99',
        width: 50,
        height: 50,
        left: 100,
        top: 100
      })
      this.canvas.add(this.chipsTag);
      
    });
  }
  get sku() {
    return this.wareHouseForm.get('sku') as FormArray;
  }
  get invoice() {
    return this.wareHouseForm.get('invoice') as FormArray;
  }
  intitialize(){
    this.canvas = new fabric.Canvas('canvas', { width: this.screenWidth - 520, height: this.screenHeight - 5 });

    //set bg image
    // this.addFloorplan();
    // Resize canvas
    
    this.buildZone = document.getElementById('buildZone');
    this.wrapper = document.getElementById('wrapper');
    this.paddingShift = 60;
  }

  addFloorplan(){
    var imgElement = document.getElementById('floorplan');
    this.imgInstance = new fabric.Image(imgElement, {
      left: 0,
      top: 0,
      opacity: 0.90,
      scaleX:0.8,
      scaleY:0.8,
    });
    this.canvas.add(this.imgInstance);
    // this.canvas.backgroundImage=this.imgInstance;
  }

  markFloorplan(){
    // this.imgInstance.selectable = false;
    this.canvas.preserveObjectStacking = true;
    this.imgInstance.lockMovementX = true;
    this.imgInstance.lockMovementY = true;
    this.imgInstance.lockRotation = true;
    this.imgInstance.lockScalingFlip = true;
    this.imgInstance.lockScalingX = true;
    this.imgInstance.lockScalingY = true;
    this.imgInstance.lockSkewingX = true;
    this.imgInstance.lockSkewingY = true;

    this.markedFloorplan = new fabric.Rect({
      strokeWidth: 2,
      borderColor: '#ff0000',
      borderScaleFactor: 5,
      stroke: 'transparent',
      fill: 'transparent',
      width: 400,
      height: 400,
      left: 100,
      top: 100
    });
    this.canvas.add(this.markedFloorplan);
    this.markedFloorplan.bringToFront();
  }
  saveFloorplan(){
    // this.canvas.sendBackwards(this.imgInstance);
    // this.markedFloorplan.selectable = false;
    this.canvas.preserveObjectStacking = true;
    this.markedFloorplan.lockMovementX = true;
    this.markedFloorplan.lockMovementY = true;
    this.markedFloorplan.lockRotation = true;
    this.markedFloorplan.lockScalingFlip = true;
    this.markedFloorplan.lockScalingX = true;
    this.markedFloorplan.lockScalingY = true;
    this.markedFloorplan.lockSkewingX = true;
    this.markedFloorplan.lockSkewingY = true;
  }

  removeFloorplan(){
    // this.chipsTag.remove();
    // this.soapTag.remove();
    // this.biscuitTag.remove();
    // this.shampooTag.remove();
    // this.markedFloorplan.remove();
    // this.imgInstance.remove();
    this.canvas.clear();
  }

  resizeCanvas() {
    // Width
    const newWidth = this.canvas.getWidth() + (window.innerWidth - (this.buildZone.offsetWidth + this.paddingShift));
    if(newWidth < 640 && newWidth > 200) this.canvas.setWidth(newWidth);
    
    // Height
    const newHeight = this.canvas.getHeight() + (window.innerHeight - (this.wrapper.offsetHeight + this.paddingShift));
    if(newHeight < 360 && newHeight > 250) this.canvas.setHeight(newHeight);
  }

  deleteActiveObjects() {
    const activeObjects = this.canvas.getActiveObjects();
    if(!activeObjects.length) return false;
    
    if(activeObjects.length) {
      activeObjects.forEach((object)=> {
        this.canvas.remove(object);
      });
    } else {
      this.canvas.remove(activeObjects);
    }
    
    return true;
  }

  saveTags(){
    console.log(this.canvas.getObjects());
     this.jsonOutput = this.canvas.getObjects();

     this.jsonOutput = this.jsonOutput.map((area)=>{
        let volume = this.calculateVolume(
          area.width* ( area.scaleX || 1),
          area.height* ( area.scaleY || 1),
          3*this.wareHouseForm.get('units').value);
        area.actualWidth = area.width* ( area.scaleX || 1);
        area.actualHeight = area.height* ( area.scaleY || 1);
        area.volume = volume;
        area.area = area.actualWidth * area.actualHeight;
        return area;
     })

     console.log(this.sku);

     this.skuData = this.sku.value.map(sku => {
       return {
          length:sku.length,
          height:sku.height,
          width:sku.width,
          volume: sku.length * sku.height * sku.width
      }
     });
     this.skuCapacity = [0,0,0,0]
     this.skuData = this.skuData.map((sku, index)=>{

        sku.quantity = Math.floor(Math.floor( this.jsonOutput[index+2].volume) / sku.volume) ;
        this.skuCapacity[index] = sku.quantity;
        return sku;
     })
     console.log(this.skuData);
  }

  calculateVolume(height,width,length){
    return height * width * length;
  }

  getSkuVolume(){
    return this.calculateVolume(this.skuHeight, this.skuLength, this.skuWidth);
  }

  getBlockVolume(blockWidth, blockLength){
    return this.calculateVolume(blockWidth, blockLength, 3 * this.units);
  }

  showHeatmap(){
    let objects = this.canvas.getObjects();
    if(objects.length > 6){
      while(objects.length > 6){
        this.canvas.remove(objects.pop());
      }
    }
    this.invoice.value.forEach((item,index)=>{
      let heatmap = (this.jsonOutput[index+2].area/this.skuData[index].quantity)* item.quantity;
      let originalRadius = (this.jsonOutput[index+2].actualHeight < this.jsonOutput[index+2].actualWidth?
                          this.jsonOutput[index+2].actualHeight:this.jsonOutput[index+2].actualWidth)/2;

      let newRadius = (originalRadius/this.jsonOutput[index+2].area)* heatmap;
      this.canvas.add(new fabric.Circle({
        radius: newRadius,
        strokeWidth: 2,
        stroke: '#0099ff',
        fill: '#0099ff',
        left: this.jsonOutput[index+2].left,
        top: this.jsonOutput[index+2].top
      }));
    })
  }
}
