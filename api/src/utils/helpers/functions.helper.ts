import * as crypto from 'crypto'
export class _publicfunctions {
            passwordValidator(inputData: any) { 
                    let Return_Data:any= passwordValidator(inputData);
                return Return_Data;
            } 
            generatePassword(inputData: any) { 
                let Return_Data:any= generatePassword(inputData);
                return Return_Data;
            } 
            getRandomString(inputData: any) { 
                let Return_Data:any= getRandomString(inputData);
                return Return_Data;
            } 
            getRandomint(inputData: any) { 
                if (inputData == null) {let inputData:number = 6; }
                let Return_Data:any= getRandomint(inputData);
                return Return_Data;
            } 
            getRandomchar(inputData: any) {  
                let Return_Data:any= getRandomchar(inputData);
                return Return_Data;
            } 
            toThaiDate(inputData: any) { 
                let Return_Data:any= toThaiDate(inputData);
                return Return_Data;
            } 
            toEnDate(inputData: any) { 
                let Return_Data:any= toEnDate(inputData);
                return Return_Data;
            } 
            typeofdata(input: any) {   
                    const datachecktype = typeof (input); 
                        console.log('input ',input);
                        console.log('type of ',datachecktype); 
                    return datachecktype
            } 
            timeConverter(inputData: any) { 
                let Return_Data:any= timeConverter(inputData);
                return Return_Data;
            } 
            throwIfInvalid(inputData: any) { 
                let Return_Data:any= throwIfInvalid(inputData);
                return Return_Data;
            } 
            getRandomsrtsmall(inputData: any) { 
                let Return_Data:any= getRandomsrtsmall(inputData);
                return Return_Data;
            } 
            getRandomsrtbig(inputData: any) { 
                let Return_Data:any= getRandomsrtbig(inputData);
                return Return_Data;
            } 
            timeConvertermas(inputData: any) { 
                let Return_Data:any= timeConvertermas(inputData);
                return Return_Data;
            } 
            timeConverternow() { 
                let Return_Data:any= timeConverternow();
                return Return_Data;
            } 
            toTimestamp(strDate:any) { 
                let Return_Data:any= toTimestamp(strDate);
                return Return_Data;
            }  
            isemailValid(email:any) { 
                let Return_Data:any= isemailValid(email);
                return Return_Data;
            }   
        }
        function passwordValidator(inputtxt: any) { 
            var paswd :any= "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
            if(inputtxt.match(paswd)){  
                console.log('Your validate password  Correct, try another...:'+inputtxt);
                return true;
            }else{  
                    console.log('You validate password Wrong...:'+inputtxt);
                return false;
            }
        }  
        function generatePassword(passwordLength: any) {
            var numberChars = "0123456789";
            var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var lowerChars = "abcdefghijklmnopqrstuvwxyz";
            var vaChars = "!@#$%^&*";
            var allChars = numberChars + upperChars + lowerChars+ vaChars;
            var randPasswordArray = Array(passwordLength);
            randPasswordArray[0] = numberChars;
            randPasswordArray[1] = upperChars;
            randPasswordArray[2] = lowerChars;
            randPasswordArray = randPasswordArray.fill(allChars, 3);
            return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
        }
        function shuffleArray(array: any) {
            for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            }
            return array;
        }
        function getRandomString(length: any) {
            var randomChars: any = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
            var randomChars2: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result: any =  ''
            for ( var i = 0; i < length; i++ ) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
            }
            return result
        }  
        function getRandomint(length: any) { 
        var randomChars: any =  '0123456789';
        var result: any =  ''
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        }
        return result
        }
        function toThaiDate(date: any) { 
            let monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]; 
            let year = date.getFullYear() + 543;
            let month = monthNames[date.getMonth()];
            let numOfDay = date.getDate();
            let hour = date.getHours().toString().padStart(2, "0");
            let minutes = date.getMinutes().toString().padStart(2, "0");
            let second = date.getSeconds().toString().padStart(2, "0");
            return `${numOfDay} ${month} ${year} ` +`${hour}:${minutes}:${second} น.`;
        }
        function toEnDate(date: any) { 
                let monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]; 
                let monthNameslong = ["January", "February", "March.", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
                let year = date.getFullYear()+ 0;
                let month = monthNameslong[date.getMonth()];
                let numOfDay = date.getDate();
                let hour = date.getHours().toString().padStart(2, "0");
                let minutes = date.getMinutes().toString().padStart(2, "0");
                let second = date.getSeconds().toString().padStart(2, "0");
            return `${numOfDay} ${month} ${year} ` +`${hour}:${minutes}:${second}`;
        }
        function timeConverter(UNIX_timestamp:any){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        }  
        function getRandomsrtsmall(length: any) { 
            var randomChars: any =  'abcdefghijklmnopqrstuvwxyz';
            var result: any =  ''
            for ( var i = 0; i < length; i++ ) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
            }
            return result
        }
        function getRandomsrtbig(length: any) { 
            var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var result: any =  ''
            for ( var i = 0; i < length; i++ ) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
            }
            return result
        }  
        function throwIfInvalid(value: any) {
            const max : Number = 1000000;
            const min : Number = 1;
            const values: Number =value.length;
            if(values < min || values > max){ 
                    var rts = {
                                response: { 
                                message: 'Value must be between '+min+' and '+max,
                                message_th: 'ค่าต้องอยู่ระหว่าง น้อยสุด ' + min + '  หรือค่ามากสุด ' + max,
                                status: '400',
                                time_ms: null,
                                },
                                data: 0,
                            };
                    } else {
                            var rts = {
                            response: { 
                                message: 'ok',
                                message_th: 'ok',
                                status: '200',
                                time_ms: null, 
                            },
                            data: 1,
                        };
                    }
            return rts;
        }
        function timeConvertermas(a:any){ 
                let year = a.getFullYear()+ 0;
                var month = a.getMonth().toString().padStart(2, "0");
                var date = a.getDate().toString().padStart(2, "0");
                var hour = a.getHours().toString().padStart(2, "0");
                var min = a.getMinutes().toString().padStart(2, "0");
                var sec = a.getSeconds().toString().padStart(2, "0");
                var time =  year + '-' + month + '-'+date + ' ' + hour + ':' + min + ':' + sec ;
                return time;
        } 
        function timeConverternow(){
                var a = new Date() 
                let year = a.getFullYear()+ 0;
                var month = a.getMonth().toString().padStart(2, "0");
                var date = a.getDate().toString().padStart(2, "0");
                var hour = a.getHours().toString().padStart(2, "0");
                var min = a.getMinutes().toString().padStart(2, "0");
                var sec = a.getSeconds().toString().padStart(2, "0");
                var time =  year + '-' + month + '-'+date + ' ' + hour + ':' + min + ':' + sec ;
                return time;
        }  
        function toTimestamp(strDate: any){ 
            var datum = Date.parse(strDate); return datum / 1000;
        } 
        function getRandomchar(length: any) { 
                var randomChars: any =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var result: any =  ''
                for ( var i = 0; i < length; i++ ) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
                }
                return result
        } 
        var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        function isemailValid(email: any) {
            if (!email)
                return false;

            if(email.length>254)
                return false;

            var valid = emailRegex.test(email);
            if(!valid)
                return false;

            // Further checking of some things regex can't handle
            var parts = email.split("@");
            if(parts[0].length>64)
                return false;

            var domainParts = parts[1].split(".");
            if(domainParts.some(function(part: any) { return part.length>63; }))
                return false;

            return true;
        }
        function encPassword(password: any) {
           var encPassword = crypto.createHash('md5').update(password).digest('hex');  
            return encPassword;
        }
        type ErrorWithMessage = { message: string }
        function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
            return (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as Record<string, unknown>).message === 'string'
            )
        }
        function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
                if (isErrorWithMessage(maybeError)) return maybeError
                try {
                return new Error(JSON.stringify(maybeError))
                } catch {
                // fallback in case there's an error stringifying the maybeError
                // like with circular references for example.
                return new Error(String(maybeError))
                }
        }
        function getErrorMessage(error: unknown) {
                return toErrorWithMessage(error).message
        }