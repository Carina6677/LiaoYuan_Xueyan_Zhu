var fs = require('fs');

var data = fs.readFileSync('./files/本市职工月平均工资.csv');
var aversalary = data.toString().split('\n')[1];
var highrate = aversalary * 3;
var lowrate = aversalary * 0.6;
data = fs.readFileSync('./files/绩效工资标准.csv');
var performance = data.toString().split('\n')[0].split(',');
var perSalary = data.toString().split('\n')[1].split(',');
data = fs.readFileSync('./files/个税税率.csv');
var personsalary = data.toString().split('\n')[0].split(',');
var persontax = data.toString().split('\n')[1].split(',');
data = fs.readFileSync('./files/五险费率.csv');
var insuranceType = data.toString().split('\n')[0].split(',');
var compinsurance = data.toString().split('\n')[1].split(',');
var persinsurance = data.toString().split('\n')[2].split(',');

function Person(name,basicsalary,person_performance,fundsrate){
	this.name = name;
	this.basicsalary = basicsalary;
	this.person_performance = person_performance;
	if (fundsrate <= 1){
		this.fundsrate = fundsrate;	
	}else{
		
	}
}

//五险一金计算器
Person.prototype.calinsurance = function(){
	console.log(this.name+'的五险一金详情');
	this.totlesalary =eval(this.basicsalary + '+' +  perSalary[ performance.indexOf(this.person_performance)]);
	if (this.totlesalary >= highrate ){
		this.basic = highrate;
	}else if(this.totlesalary <= lowrate){
		this.basic = lowrate;
	}else{
		this.basic = this.totlesalary;
	}
	
	//开始算五险
	this.companytotal = 0;
	this.persontotal = 0;
	console.log('| '+ insuranceType[0]+ '  |'+ this.name +' | '+ compinsurance[0] + ' |');
	for (var i=1;i<insuranceType.length;i++){
		var company = compinsurance[i] * this.basic;
		var person = persinsurance[i] * this.basic;
		this.companytotal += company;
		this.persontotal += person;
		console.log('| '+ 
            insuranceType[i]   + ' | '+ person + ' | '+ company + ' |')
	}
	
	//开始算一金
	this.funds = (this.basic * this.fundsrate).toFixed(2); //小数点后保留两位
	console.log('| 住房公积金 ' + ' | '+ this.funds + ' | '+ this.funds +' |');	
	this.companytotal =  eval(this.companytotal + '+' + this.funds).toFixed(2);
	this.persontotal = eval(this.persontotal  + '+' + this.funds).toFixed(2);
	console.log('| 总计 ' + ' | '+ this.persontotal + ' | '+ this.companytotal +' |\n');
	this.taxsalary = this.totlesalary - this.persontotal; //该人交完五险一金以后的工资
}


//个税计算器：个税用taxsalary计算，应纳税收入为个人税前收入超过3500元的部分
Person.prototype.caltax = function(){
	console.log(this.name+'的收入详情');
	this.tax = 0;
	var salaryline = 3500;
	for (var i=0;i<personsalary.length-1;i++){
		if (this.taxsalary>=eval(personsalary[i+1])+salaryline){
			this.tax += (personsalary[i+1]-personsalary[i])*persontax[i];
		}else{
			this.tax += (this.taxsalary - salaryline - personsalary[i])*persontax[i];
			break;
		}
	}
	if (this.taxsalary>=salaryline+eval(personsalary[6])){
		this.tax +=  (this.taxsalary - salaryline - personsalary[6])*persontax[6];
	}
	if(this.taxsalary <= salaryline){
		this.tax = 0;
	}
    this.tax = this.tax.toFixed(2);
    console.log('| 姓名 | 岗位工资 | 绩效工资 | 五险一金（个人）|五险一金（单位）| 税前收入 | 扣税 | 税后收入 |');
    console.log('| '+ this.name + 
      	' | ' + this.basicsalary +
        ' | ' + perSalary[ performance.indexOf(this.person_performance)] +
        ' | ' + this.persontotal +
        ' | ' + this.companytotal +
        ' | ' + this.taxsalary + 
        ' | ' + this.tax + 
        ' | ' + (this.taxsalary-this.tax) + ' |\n\n');
}

//从员工名单中读取所有人员情况并显示其工资信息，但是并未实现可从键盘输入

function readFromFileAndCalculate(){
	data = fs.readFileSync('./files/员工名单.csv');
	var peoplelist = data.toString().split('\n');
	for (var i=1;i<peoplelist.length;i++){
		var lines = peoplelist[i].split(',');
		var people = new Person(lines[0],lines[1],lines[2],lines[3]);
		people.calinsurance()
		people.caltax()
	}	
}

readFromFileAndCalculate();