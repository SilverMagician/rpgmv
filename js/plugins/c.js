//=============================================================================
// color item.js
//=============================================================================
 
/*:
 * @plugindesc ��װ������ͨ����ɫ����Ʒ��
 * @author waker3
 *
 * @help ����װ��Ʒ�ʣ�����Ʒע������д<quality:7>��ʵ��װ����ɫ�任������Ϊ1-7��Ӧ��ɫ�������С�
 * 66վ��VA����һ�����ƵĽű�������˼�����һ�£����û������д��һ�����Ƶ�MV�汾��
 */
 
(function() {
        var _drawItemName = Window_Base.prototype.drawItemName
 
        Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
 
 
        Color1 = '#FFFFFF' // һ��Ʒ�ʵ�ɫ�ʣ��ף�1��
    Color2 = '#008000' //ƽӹƷ�ʵ�ɫ�ʣ��̣�2��
    Color3 = '#0000FF'//# ����Ʒ�ʵ�ɫ�ʣ�����3��
    Color4 = '#9400D3'  //  # ׿ԽƷ�ʵ�ɫ�ʣ��ϣ�4��
    Color5 = '#FF0000'// # ����Ʒ�ʵ�ɫ�ʣ��죬5��
    Color6 = '#FFA500'  //  # ��˵Ʒ�ʵ�ɫ�ʣ��ȣ�6��
    Color7 = '#FFFF00'//  # ����Ʒ�ʵ�ɫ�ʣ��ƣ�7��
    if (item) 
        {
                var iconBoxWidth = Window_Base._iconWidth + 24;
                var result = item.meta.quality;
                //if (result)
                //{
            if(result == '1') 
              {
            YANSE = Color1;
                    this.contents.fillRect(x-1, y+2, 34, -2, Color1);
                    this.contents.fillRect(x-1, y+2-1, 2, 32, Color1);
                    this.contents.fillRect(x-1, y+2+31, 34, 2, Color1);
                    this.contents.fillRect(x+33, y+2, -2, 32, Color1);
                    //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
            this.drawIcon(item.iconIndex, x, y+2 );
 
                    this.changeTextColor(Color1);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
               }
       else if (result == '2') 
          {
        YANSE = Color2;
                this.contents.fillRect(x-1, y+2, 34, -2, Color2);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color2);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color2);
                this.contents.fillRect(x+33, y+2, -2, 32, Color2);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
      }
          else if (result == '3')
                  {
        YANSE = Color3;
                this.contents.fillRect(x-1, y+2, 34, -2, Color3);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color3);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color3);
                this.contents.fillRect(x+33, y+2, -2, 32, Color3);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color3);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
           else if (result == '4') 
          {
        YANSE = Color4;
                this.contents.fillRect(x-1, y+2, 34, -2, Color4);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color4);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color4);
                this.contents.fillRect(x+33, y+2, -2, 32, Color4);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color4);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
      }
          else if (result == '5')
                  {
        YANSE = Color5;
                this.contents.fillRect(x-1, y+2, 34, -2, Color5);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color5);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color5);
                this.contents.fillRect(x+33, y+2, -2, 32, Color5);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color5);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
          }
          else if (result == '6') 
          {
        YANSE = Color6;
                this.contents.fillRect(x-1, y+2, 34, -2, Color6);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color6);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color6);
                this.contents.fillRect(x+33, y+2, -2, 32, Color6);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color6);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
      }
          else if (result == '7') 
          {
        YANSE = Color7;
                this.contents.fillRect(x-1, y+2, 34, -2, Color7);
                this.contents.fillRect(x-1, y+2-1, 2, 32, Color7);
                this.contents.fillRect(x-1, y+2+31, 34, 2, Color7);
                this.contents.fillRect(x+33, y+2, -2, 32, Color7);
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        this.drawIcon(item.iconIndex, x, y+2 );
 
                this.changeTextColor(Color7);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
      }
          else {
         this.drawIcon(item.iconIndex, x, y+2 );
 
                this.resetTextColor();
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
           }
 
    }
        //else
        //{
        //        his.drawIcon(item.iconIndex, x, y+2 );
        //        
                //this.resetTextColor();
     //   this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);}
 
 
                //this.contents.fillRect(x+-1, y+1, 34, 34, '#ff1493');
                //this.contents.fillRect(x-1, y+2, 34, -2, '#ff1493');
                //this.contents.fillRect(x-1, y+2-1, 2, 32, '#ff1493');
                //this.contents.fillRect(x-1, y+2+31, 34, 2, '#ff1493');
                //this.contents.fillRect(x+33, y+2, -2, 32, '#ff1493');
                //this.contents.fillRect(x+2+32, y+2, 1+2, 33+2, '#ff1493');
        //this.drawIcon(item.iconIndex, x, y+2 );
 
                //this.changeTextColor('#ff1493');
        //this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
   // }
    //}
        ;
 
 
}
})();
