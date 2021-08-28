var TaxYear;
document.getElementById("2021").addEventListener("click", function(){TaxYear = 2021,ChangeText("taxyear",TaxYear)});
document.getElementById("2020").addEventListener("click", function(){TaxYear = 2020,ChangeText("taxyear",TaxYear)});
document.getElementById("2019").addEventListener("click", function(){TaxYear = 2019,ChangeText("taxyear",TaxYear)});


var EmploymentType;
document.getElementById("fulltime").addEventListener("click", function(){EmploymentType = "Full time", ChangeText("employ",EmploymentType)});
document.getElementById("parttime").addEventListener("click", function(){EmploymentType = "Part time",ChangeText("employ",EmploymentType);});
document.getElementById("casual").addEventListener("click", function(){EmploymentType = "Casual",ChangeText("employ",EmploymentType);});


function ChangeText(WhichID,WhichText ){
    document.getElementById(WhichID).innerHTML=(WhichText + " selected.");
}


CalculateTax = function (TaxYear, YearPay) {

    if (TaxYear == "2019") {
        brackets = [18200, 37000, 90000, 180000];
        rates = [0.19, 0.325, 0.37, 0.45];
        set_Tax = [3572, 20797, 54097];
    }

    else if (TaxYear == "2020" || TaxYear=="2021") {
        brackets = [18200, 45000, 120000, 180000];
        rates = [0.19, 0.325, 0.37, 0.45];
        set_Tax = [5092, 29467, 51667];
    }

    if (YearPay <= (brackets[0])) {
        Tax = 0;
    }
    else if ((brackets[0]) < YearPay <= (brackets[1])) {
        Tax = (YearPay - (brackets[0])) * (rates[0]);
    }

    else if ((brackets[1]) <= YearPay <= (brackets[2])) {
        Tax = (YearPay - (brackets[1])) * (rates[1]) + (set_Tax[0]);
    }
    else if ((brackets[2]) < YearPay <= (brackets[3])) {
        Tax = (YearPay - (brackets[2])) * (rates[2]) + (set_Tax[1]);
    }
    else if (YearPay > (brackets[3])) {
        Tax = (YearPay - (brackets[3])) * (rates[3]) + (set_Tax[2]);
    }
    return Tax;
}


CalculateMedicareLevy = function (YearPay) {
    let medicarelevy;
    if (YearPay >= 28501) {
        medicarelevy = YearPay * 0.02;
    }
    else if (YearPay <= 28500) {
        medicarelevy = 0;
    }
    return medicarelevy
}


OffSets = {
    LowTaxOffset : function(YearPay, Tax,MaximumOffset, OffSetRate){
        if(YearPay <= 18200)
        {
            LowOffSet = 0;
        }
        else if( 18200 < YearPay <= 37500){

            if (Tax >= MaximumOffset)
            {
                LowOffSet = MaximumOffset;
            }
            else if( Tax <= MaximumOffset)
            {
                LowOffSet = Tax;
            }
        }
        else if(37501 <= YearPay <= 45000)
        {
            LowOffSet = MaximumOffset - ((YearPay - 37500) * OffSetRate);

        }else if( 45001 <= YearPay <= 66667)
        {
            LowOffSet = 325 - ((YearPay - 45000) * 0.015);
        }

        else if( YearPay >= 66668)
        {
            LowOffSet = 0;
        }
       
        return LowOffSet;

    },
            
    MiddleIncomeOffset : function(YearPay,Tax,MaximumOffset)
    {
        let MiddleOffSet;

        if(YearPay <= 18200)
            MiddleOffSet = 0;

        else if(18200 < YearPay <= 37000)
        {
            
            if(Tax <= MaximumOffset){
                MiddleOffSet = 0;

            }else if( MaximumOffset < Tax < 955){
                MiddleOffSet = 255;
            }

            else if (Tax >= 955)
            {
                
                MiddleOffSet = 255;
            }

        }else if (37001 <= YearPay <= 48000){
            MiddleOffSet = 255 + ((YearPay - 37000) * 0.075);
        }
        else if (48001 <= YearPay <= 90000){
            MiddleOffSet = 1080;
        }

        else if (90001 <= YearPay <= 126000){
            MiddleOffSet = 1080 - ((YearPay - 90001) * 0.03);
        }

        else if (YearPay >= 126000){
            MiddleOffSet = 0;
        }

        return MiddleOffSet;

    }
};


CalculateOvertime = function (Payrate, RateForCalculations, TotalHours, TotalPay, EmploymentType) {
    {
        let CalculateOvertimeRate;
        let Over41Hours;
        let Over41HoursRate;

        if (EmploymentType == "casual") {
            CalculateOvertimeRate = RateForCalculations * 0.50 + RateForCalculations * 0.25 + RateForCalculations;
            Over41Hours = ((RateForCalculations * 0.50 + RateForCalculations * 0.25 + RateForCalculations) * 3);
            Over41HoursRate = RateForCalculations * 0.25 + RateForCalculations * 2;
        } else {
            CalculateOvertimeRate = RateForCalculations * 0.50 + RateForCalculations;
            Over41Hours = ((RateForCalculations * 0.50 + RateForCalculations) * 3);
            Over41HoursRate = RateForCalculations * 2;
        }
        

        if (TotalHours >= 38) {
            HoursForCalculation = TotalHours - 38;

            if (38 < TotalHours <= 41) {
                Pay = ((TotalHours - 38) * (CalculateOvertimeRate)) + TotalPay - Payrate * HoursForCalculation;
            
            }
            else if (TotalHours >= 42) {
                Pay = (((TotalHours - 41) * Over41HoursRate) + Over41Hours) + TotalPay - Payrate * HoursForCalculation;
                
            } else {
                Pay = TotalPay;
                HoursForCalculation = 0;
            }
        } else {
            Pay = TotalPay;
        }
        return Pay;
    }
}

Calculate = {
    OnClick: function () {
        console.log(EmploymentType);
        
        if(EmploymentType == undefined){
            document.getElementById("debug").innerHTML = "Error! Please select an employment type and try again!";
            return;
        }
        if(TaxYear == undefined){
            document.getElementById("debug").innerHTML = "Error! Please select a tax year and try again!";
            return;
        } 
        if(TaxYear != undefined && EmploymentType != undefined){
            document.getElementById("debug").innerHTML = "";
        }

        let WeeklyHours = Number(document.getElementById("WeeklyHours").value);
        let SaturdayHours = Number(document.getElementById("SaturdayHours").value);
        let SundayHours = Number(document.getElementById("SundayHours").value);
        let PublicHolidayHours = Number(document.getElementById("PublicHolidayHours").value);
        let MaximumOffset;
        let OffSetRate;

        if(TaxYear == "2019")
        {
            MaximumOffset = 445;
            OffSetRate = 0.0165;
        }
            
        else if(TaxYear == "2020")
        {
            MaximumOffset = 700;
            OffSetRate = 0.05;
        }

        let Payrate = Number(document.getElementById("Payrate").value);
        let RateForCalculations = Payrate;
        let SaturdayRate;
        let SundayRate;
        let PublicHolidayRate = Payrate * 2;

        if (EmploymentType == "Casual") {
            RateForCalculations = Payrate / 1.25;
            SaturdayRate = RateForCalculations * 0.50 + RateForCalculations;
            SundayRate = RateForCalculations * 0.50 + RateForCalculations * 0.25 + RateForCalculations;
        } else {
            SaturdayRate = Payrate * 0.25 + Payrate;
            SundayRate = Payrate * 0.50 + Payrate;
        }
        
        let WeekPay = WeeklyHours * Payrate;
        let SaturdayPay = SaturdayHours * SaturdayRate;
        let Sundaypay = SundayHours * SundayRate;
        let PublicHolidayPay = PublicHolidayHours * PublicHolidayRate

        let TotalPay = WeekPay + SaturdayPay + Sundaypay + PublicHolidayPay;
        let TotalHours = WeeklyHours + SaturdayHours + SundayHours + PublicHolidayHours;

        let Pay = CalculateOvertime(Payrate, RateForCalculations, TotalHours, TotalPay, EmploymentType);
        let YearPay = Pay*52;

        let MedicareLevyYear = CalculateMedicareLevy(YearPay);
        let Tax = CalculateTax(TaxYear, YearPay);
        let TaxForWeek = Tax/52;

        let LowOffset = OffSets.LowTaxOffset(YearPay, Tax, MaximumOffset, OffSetRate);
        let MiddleOffset = OffSets.MiddleIncomeOffset(YearPay, Tax, MaximumOffset);

        let TotalOffset = LowOffset + MiddleOffset;
        
        let LowOffsetweek = LowOffset/52;
        let Middleoffsetweek = MiddleOffset/52;
        let Totaloffsetweek = TotalOffset/52;

        let MedicareLevyWeek = MedicareLevyYear/52;
        PayAfterTax = YearPay - Tax - MedicareLevyYear + TotalOffset;
        WeeklyPayAfterTax = PayAfterTax/52;

        document.getElementById("payrate").innerHTML = "Your payrate is: $" + Payrate; 

        document.getElementById("employment").innerHTML = "Your employment type is: " + EmploymentType;
        
        document.getElementById("weekpaybeforetax").innerHTML = "Your pay, before tax, for the week is: $" + Pay + ".";
        document.getElementById("yearpaybeforetax").innerHTML = "Your pay, before tax, for the entire year is: $" + YearPay + ".";

        document.getElementById("weekpayaftertax").innerHTML = "Your pay, after tax, for the week is: $" + WeeklyPayAfterTax + ".";
        document.getElementById("yearpayaftertax").innerHTML = "Your pay, after tax, for the entire year is: $" + PayAfterTax + ".";

        document.getElementById("medicarelevyweek").innerHTML = "Medicare levy for the week is: $"+ MedicareLevyWeek + ".";
        document.getElementById("medicarelevyyear").innerHTML = "Medicare levy for the year is: $"+ MedicareLevyYear + ".";

        document.getElementById("taxfortheweek").innerHTML = "For the week, you will pay $" + TaxForWeek + " in taxes.";
        document.getElementById("taxfortheyear").innerHTML = "On this payrate, over a year, you will pay $" + Tax + " in taxes.";

        document.getElementById("lowoffsetweek").innerHTML = "For the week, you get a low tax offset of: $" + LowOffsetweek + ".";
        document.getElementById("lowoffsetyear").innerHTML = "For the year, you get a low tax offset of: $" + LowOffset + ".";

        document.getElementById("middleoffsetweek").innerHTML = "For the week, you will get a middle offset of: $" + Middleoffsetweek + ".";
        document.getElementById("middleoffsetyear").innerHTML = "For the year, you will get a middle offset of: $" + MiddleOffset + ".";

        document.getElementById("totaloffsetweek").innerHTML = "For the week, you will get a total offset of: $" + Totaloffsetweek + ".";
        document.getElementById("totaloffsetyear").innerHTML = "For the year, you will get a total offset of: $" + TotalOffset + ".";
    }

}
let CalcButton = document.getElementById("calculate");
CalcButton.addEventListener("click", Calculate.OnClick);










