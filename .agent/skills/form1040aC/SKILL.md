---
name: form1040aC
description: A specialized skill for handling the Form 1040 Schedule C (Business Profit/Loss) data entry and calculations including COGS, Vehicle Info, and Other Expenses.
---

# form1040aC Skill

This skill manages the complex data entry for the U.S. Individual Income Tax Return - Schedule C (Profit or Loss From Business).

## Data Structure

The skill manages five primary parts:

### 1. Business Info & Income (Parte I)

- Box 1: Gross receipts or sales
- Box 4: Cost of goods sold (Linked to Parte III, Line 42)
- Box 7: Gross Income (Calculated)

### 2. Business Expenses (Parte II)

- Box 8-27: Detailed expense categories.
- Box 28: Total Expenses (Calculated)
- Box 31: Net Profit or Loss (Calculated)

### 3. Cost of Goods Sold (Parte III)

- Box 35: Inventory at beginning of year
- Box 36: Purchases
- Box 37: Cost of labor
- Box 38: Materials and supplies
- Box 39: Other costs
- Box 40: Sum of lines 35-39 (Calculated)
- Box 41: Inventory at end of year
- Box 42: Cost of goods sold (Line 40 minus Line 41) -> Feeds Parte I, Line 4.

### 4. Vehicle Information (Parte IV)

- Line 43: Date placed in service
- Line 44: Mileage (Business/Commuting/Other)
- Line 45-47: Evidence and usage questions (Yes/No)

### 5. Other Expenses (Parte V)

- Itemized list of business expenses not covered in Parte II.
- Box 48: Total other expenses (Calculated) -> Feeds Parte II, Line 27a.

## Calculation Engine

- **COGS**: `(Line 35 + 36 + 37 + 38 + 39) - Line 41 = Line 42`
- **Gross Income**: `Line 1 - Line 2 - Line 4 + Line 6 = Line 7`
- **Net Profit**: `Line 7 - Line 28 - Line 30 = Line 31`

## Nerea's Updated Advice (2026)

### Part I: Income
>
> [!TIP]
> **Maximize Reporting Accuracy**: For 2026, ensure all 1099-K, 1099-NEC, and 1099-MISC are reconciled. Nerea recommends double-checking "Statutory Employee" status if you have a W-2, as it allows deducting expenses directly on Schedule C without the 2% floor!

### Part II: Expenses
>
> [!IMPORTANT]
> **New for 2026**: Digital platform fees and software subscriptions for business operations are fully deductible. Ensure you separate personal and business use for "Utilities" and "Cell Phone" plans to avoid IRS red flags.

### Part III: Cost of Goods Sold
>
> [!NOTE]
> **Inventory Valuation**: If your gross receipts are under $26 million, you might qualify for simplified accounting. Nerea suggests reviewing if "Cash Method" for inventory is more beneficial for your cash flow this year.

### Part IV: Vehicle Info
>
> [!WARNING]
> **Strict Mileage Logs**: The IRS is increasing audits on vehicle deductions. Use a digital log app! For 2026, the standard mileage rate has been adjusted—make sure you're using the latest rate ($0.67/mile estimated) for maximum benefit.

### Part V: Other Expenses
>
> [!TIP]
> **Don't Forget Micro-Expenses**: Small items like professional memberships, specialized industry news subscriptions, and even small bank fees add up. If it's ordinary and necessary for your business, list it here!
