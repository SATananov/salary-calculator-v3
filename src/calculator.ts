import { Dealer, DealerMonthlyData, CalculationResult, Location } from './types.js';

// Изчисляване на бруто заплата
export function calculateBruto(
    salary: number,
    globalTurnover: number,
    personalTurnover: number,
    coefGeneral: number,
    coefPersonal: number
): number {
    // Формула: Бруто = Осн. заплата + (Общ оборот × Коеф. общ) + (Собствен оборот × Коеф. собствен)
    const bruto = salary + (globalTurnover * coefGeneral) + (personalTurnover * coefPersonal);
    return Math.round(bruto * 100) / 100;
}

// Изчисляване на бонус
export function calculateBonus(bruto: number, salary: number, vouchers: number): number {
    // Формула: Бонус = Бруто - Осн. заплата - Ваучери
    const bonus = bruto - salary - vouchers;
    return Math.round(bonus * 100) / 100;
}

// Изчисляване за един дилър
export function calculateForDealer(
    dealer: Dealer,
    monthlyData: DealerMonthlyData,
    globalTurnover: number,
    month: string,
    year: number,
    locations: Location[]
): CalculationResult {
    const bruto = calculateBruto(
        monthlyData.salary,
        globalTurnover,
        monthlyData.personalTurnover,
        dealer.coefGeneral,
        dealer.coefPersonal
    );
    
    const bonus = calculateBonus(bruto, monthlyData.salary, monthlyData.vouchers);
    
    // Намиране на името на обекта
    const location = locations.find(l => l.id === dealer.locationId);
    const locationName = location ? `${location.name} (${location.city})` : 'Неизвестен';
    
    return {
        name: dealer.name,
        locationName,
        month,
        year,
        salary: monthlyData.salary,
        globalTurnover,
        personalTurnover: monthlyData.personalTurnover,
        coefGeneral: dealer.coefGeneral,
        coefPersonal: dealer.coefPersonal,
        vouchers: monthlyData.vouchers,
        bruto,
        bonus
    };
}

// Изчисляване за всички дилъри
export function calculateForAllDealers(
    dealers: Dealer[],
    monthlyDataMap: Map<number, DealerMonthlyData>,
    globalTurnover: number,
    month: string,
    year: number,
    locations: Location[]
): CalculationResult[] {
    const results: CalculationResult[] = [];
    
    for (const dealer of dealers) {
        const monthlyData = monthlyDataMap.get(dealer.id);
        
        if (monthlyData) {
            const result = calculateForDealer(dealer, monthlyData, globalTurnover, month, year, locations);
            results.push(result);
        }
    }
    
    // Сортиране по обект
    results.sort((a, b) => a.locationName.localeCompare(b.locationName));
    
    return results;
}
