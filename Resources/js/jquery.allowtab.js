$.fn.allowtab = function (options){
        console.log(this);
        console.log(this.get(0).nodeName);
        var self = this;
        if (this.get(0).nodeName === 'TEXTAREA') {
                self.focusin(function(){
                        self.bind('keydown', 'tab', function(keyEvent){
                                if (keyEvent.keyCode === 9) {
                                        // console.log(self.selectRange(1, 2));

                                        keyEvent.preventDefault(); // 阻止默认事件

                                        var inputBox = self.get(0);
                                        console.log(inputBox);
                                        var start =         0;
                                        var end = 0;
                                        
                                        if (typeof inputBox.selectionStart == 'number') {
                                                // 如果支持selectionstart, 这可直接获取选中开始位置和结束位置
                                                start = inputBox.selectionStart;
                                                end = inputBox.selectionEnd;
                                                console.log(start, ':', end);
                                        } else if (inputBox.createTextRange) {
                                                // 旧版IE不支持selectionStart, 需要通过TextRange来间接获取选中开始和结束位置
                                        var inpTxtLen = inputBox.value.length;
                                        var inpRange = inputBox.createTextRange()        ;
                                        inpRange.moveToBookmark(document.selection.createRange().getBookmark());

                                        start = -1 * inpRange.moveStart('character', -1 * inpTxtLen);
                                        end = inpTxtLen - inpRange.moveEnd('character', inpTxtLen);
                                        }

                                        // 选中一段文字时候不做处理， 如果要多行处理通过正则匹配在每个\n的地方替换为\n\t即可
                                        if (start === end) {
                                            // 相等时候在selectionStart处添加\t
                                            inputBox.value = inputBox.value.slice(0, start) + "\t" + this.value.slice(start);        

                                            if(inputBox.createTextRange)
                                            {
                                                var selRange = inputBox.createTextRange();

                                                var inpTxtLen = inputBox.value.length;
                                                selRange.moveStart('character', start + 1);
                                                selRange.moveEnd('character', -1 *(inpTxtLen - start - 1));
                                                selRange.select();
                                            } else if(inputBox.setSelectionRange) {
                                                        // 设置光标位置
                                                        inputBox.selectionStart = start + 1;
                                                        inputBox.selectionEnd = start + 1;
                                            }
                                        }
                                }

                        });
                });
                self.focusout(function(){
                        self.unbind('keydown');
                });
        }
};