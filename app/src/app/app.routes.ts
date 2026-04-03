import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { landingGuard } from './guards/landing.guard';

// Layouts
import { LayoutComponent } from './layouts/layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';

export const routes: Routes = [
    // Public Routes with Main Layout (Landing, Home, Blog)
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent),
                canActivate: [landingGuard]
            },
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
                canActivate: [authGuard]
            },
            {
                path: 'blog',
                loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
            }
        ]
    },

    // Special Standalone
    {
        path: 'wizard',
        loadComponent: () => import('./pages/wizard/wizard.component').then(m => m.WizardComponent)
    },

    // Dashboard Routes (Explicitly defined to avoid LayoutComponent collision)
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) }]
    },
    {
        path: 'clients',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent) }]
    },
    {
        path: 'returns',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/returns/returns.component').then(m => m.ReturnsComponent) }]
    },
    {
        path: 'upload',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/upload/upload.component').then(m => m.UploadComponent) }]
    },
    {
        path: 'calculator',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/calculator/calculator.component').then(m => m.CalculatorComponent) }]
    },
    {
        path: 'profile',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) }]
    },
    {
        path: 'settings',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) }]
    },
    {
        path: 'agent',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/agent/agent.component').then(m => m.AgentComponent) }]
    },
    {
        path: 'herramientas-ia',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/ai-tools/ai-tools.component').then(m => m.AiToolsPageComponent) }]
    },
    {
        path: 'reports',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) }]
    },
    {
        path: 'free-dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/free-dashboard/free-dashboard.component').then(m => m.FreeDashboardComponent) }]
    },
    {
        path: 'premium-dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/premium-dashboard/premium-dashboard.component').then(m => m.PremiumDashboardComponent) }]
    },
    {
        path: 'bloginfo',
        component: DashboardLayoutComponent,
        children: [
            { path: '', loadComponent: () => import('./pages/bloginfo/bloginfo.component').then(m => m.BloginfoComponent) },
            { path: ':id', loadComponent: () => import('./pages/blog-article/blog-article.component').then(m => m.BlogArticleComponent) }
        ]
    },

    {
        path: 'schedule1-a',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./pages/schedule1-a-page/schedule1-a-page.component').then(m => m.Schedule1APageComponent) }]
    },

    {
        path: 'schedule1-a-only',
        loadComponent: () => import('./pages/schedule1-a-page/schedule1-a-page.component').then(m => m.Schedule1APageComponent)
    },

    // Formularios (Modelos IRS)
    {
        path: 'schedule-1-a',
        loadComponent: () => import('./pages/schedule1-a-page/schedule1-a-page.component').then(m => m.Schedule1APageComponent)
    },
    {
        path: 'schedule-2',
        loadComponent: () => import('./pages/schedule2-page/schedule2-page.component').then(m => m.Schedule2PageComponent)
    },
    {
        path: 'schedule-3',
        loadComponent: () => import('./components/forms/f1040s3/f1040s3.component').then(m => m.F1040s3Component)
    },
    {
        path: 'f1040s8',
        loadComponent: () => import('./components/forms/f1040s8/f1040s8.component').then(m => m.F1040s8Component)
    },

    {
        path: 'f1040s1',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [{ path: '', loadComponent: () => import('./components/forms/f1040s1/f1040s1.component').then(m => m.F1040s1Component) }]
    },
    {
        path: 'f1040s1-only',
        loadComponent: () => import('./components/forms/f1040s1/f1040s1.component').then(m => m.F1040s1Component)
    },
    {
        path: 'f1040s8-only',
        loadComponent: () => import('./components/forms/f1040s8/f1040s8.component').then(m => m.F1040s8Component)
    },
    {
        path: 'f8962',
        loadComponent: () => import('./components/forms/f8962/f8962.component').then(m => m.F8962Component)
    },
    {
        path: 'form1099ltc',
        loadComponent: () => import('./components/forms/form1099ltc/form1099ltc.component').then(m => m.Form1099ltcComponent)
    },
    {
        path: 'form1099sa',
        loadComponent: () => import('./components/forms/form1099sa/form1099sa.component').then(m => m.Form1099saComponent)
    },
    {
        path: 'form1099b',
        loadComponent: () => import('./components/forms/form1099b/form1099b.component').then(m => m.Form1099bComponent)
    },
    {
        path: 'form3903',
        loadComponent: () => import('./components/forms/form3903/form3903.component').then(m => m.Form3903Component)
    },
    {
        path: 'form1040sr',
        loadComponent: () => import('./components/forms/form1040-sr/form1040-sr.component').then(m => m.Form1040SRComponent)
    },
    {
        path: 'form1099k',
        loadComponent: () => import('./components/forms/form1099k/form1099k.component').then(m => m.Form1099kComponent)
    },
    {
        path: 'formw2',
        loadComponent: () => import('./components/forms/formw2/formw2.component').then(m => m.Formw2Component)
    },
    {
        path: 'formw2as',
        loadComponent: () => import('./components/forms/formw2as/formw2as.component').then(m => m.Formw2asComponent)
    },
    {
        path: 'formw2gu',
        loadComponent: () => import('./components/forms/formw2gu/formw2gu.component').then(m => m.Formw2guComponent)
    },
    {
        path: 'formw2vi',
        loadComponent: () => import('./components/forms/formw2vi/formw2vi.component').then(m => m.Formw2viComponent)
    },
    {
        path: 'form4137',
        loadComponent: () => import('./components/forms/form4137/form4137.component').then(m => m.Form4137Component)
    },
    {
        path: 'form8889',
        loadComponent: () => import('./components/forms/form8889/form8889.component').then(m => m.Form8889Component)
    },
    {
        path: 'form8853',
        loadComponent: () => import('./components/forms/form8853/form8853.component').then(m => m.Form8853Component)
    },
    {
        path: 'formw8ben',
        loadComponent: () => import('./components/forms/formw8ben/formw8ben.component').then(m => m.FormW8benComponent)
    },
    {
        path: 'schedule-c',
        loadComponent: () => import('./components/forms/schedule-c/schedule-c.component').then(m => m.ScheduleCComponent)
    },
    {
        path: 'form1040nr',
        loadComponent: () => import('./components/forms/form1040nr/form1040nr.component').then(m => m.Form1040nrComponent)
    },
    {
        path: 'test-1040',
        loadComponent: () => import('./components/forms/form1040-principal/form1040-principal.component').then(m => m.Form1040PrincipalComponent)
    },
    // Fallback
    {
        path: 'update',
        loadComponent: () => import('./pages/update/update.component').then(m => m.UpdateComponent)
    },

    { path: 'form8936', loadComponent: () => import('./components/forms/form8936/form8936.component').then(m => m.Form8936Component) },
    { path: 'form990t', loadComponent: () => import('./components/forms/form990t/form990t.component').then(m => m.Form990tComponent) },
    { path: 'form4255', loadComponent: () => import('./components/forms/form4255/form4255.component').then(m => m.Form4255Component) },
    { path: 'form3468', loadComponent: () => import('./components/forms/form3468/form3468.component').then(m => m.Form3468Component) },
    { path: 'form1120', loadComponent: () => import('./components/forms/form1120/form1120.component').then(m => m.Form1120Component) },
    { path: 'form7220', loadComponent: () => import('./components/forms/form7220/form7220.component').then(m => m.Form7220Component) },
    { path: 'form5329', loadComponent: () => import('./components/forms/form5329/form5329.component').then(m => m.Form5329Component) },
    { path: 'form8606', loadComponent: () => import('./components/forms/form8606/form8606.component').then(m => m.Form8606Component) },
    { path: 'form1099r', loadComponent: () => import('./components/forms/form1099r/form1099r.component').then(m => m.Form1099rComponent) },
    { path: 'form8915f', loadComponent: () => import('./components/forms/form8915f/form8915f.component').then(m => m.Form8915fComponent) },
    { path: 'form8611', loadComponent: () => import('./components/forms/form8611/form8611.component').then(m => m.Form8611Component) },
    { path: 'form8586', loadComponent: () => import('./components/forms/form8586/form8586.component').then(m => m.Form8586Component) },
    { path: 'form8609', loadComponent: () => import('./components/forms/form8609/form8609.component').then(m => m.Form8609Component) },
    { path: 'form8609a', loadComponent: () => import('./components/forms/form8609a/form8609a.component').then(m => m.Form8609aComponent) },
    { path: 'form8693', loadComponent: () => import('./components/forms/form8693/form8693.component').then(m => m.Form8693Component) },
    { path: 'form8621', loadComponent: () => import('./components/forms/form8621/form8621.component').then(m => m.Form8621Component) },
    { path: 'schedulej', loadComponent: () => import('./components/forms/schedulej/schedulej.component').then(m => m.SchedulejComponent) },
    { path: 'form8621a', loadComponent: () => import('./components/forms/form8621a/form8621a.component').then(m => m.Form8621aComponent) },
    { path: 'form8697', loadComponent: () => import('./components/forms/form8697/form8697.component').then(m => m.Form8697Component) },
    { path: 'form8919', loadComponent: () => import('./components/forms/form8919/form8919.component').then(m => m.Form8919Component) },
    { path: 'form8960', loadComponent: () => import('./components/forms/form8960/form8960.component').then(m => m.Form8960Component) },
    { path: 'form8833', loadComponent: () => import('./components/forms/form8833/form8833.component').then(m => m.Form8833Component) },
    { path: 'form965a', loadComponent: () => import('./components/forms/form965a/form965a.component').then(m => m.Form965aComponent) },
    { path: 'form965c', loadComponent: () => import('./components/forms/form965c/form965c.component').then(m => m.Form965cComponent) },
    { path: 'form965d', loadComponent: () => import('./components/forms/form965d/form965d.component').then(m => m.Form965dComponent) },
    { path: 'form965e', loadComponent: () => import('./components/forms/form965e/form965e.component').then(m => m.Form965eComponent) },
    { path: 'form1116', loadComponent: () => import('./components/forms/form1116/form1116.component').then(m => m.Form1116Component) },
    { path: 'form1118', loadComponent: () => import('./components/forms/form1118/form1118.component').then(m => m.Form1118Component) },
    { path: 'form5713', loadComponent: () => import('./components/forms/form5713/form5713.component').then(m => m.Form5713Component) },
    { path: 'form7204', loadComponent: () => import('./components/forms/form7204/form7204.component').then(m => m.Form7204Component) },
    { path: 'form8689', loadComponent: () => import('./components/forms/form8689/form8689.component').then(m => m.Form8689Component) },
    { path: 'form8898', loadComponent: () => import('./components/forms/form8898/form8898.component').then(m => m.Form8898Component) },
    { path: 'form8992', loadComponent: () => import('./components/forms/form8992/form8992.component').then(m => m.Form8992Component) },
    { path: 'sk3', loadComponent: () => import('./components/forms/sk3/sk3.component').then(m => m.Sk3Component) },
    { path: 'form4136', loadComponent: () => import('./components/forms/form4136/form4136.component').then(m => m.Form4136Component) },
    { path: 'form637', loadComponent: () => import('./components/forms/form637/form637.component').then(m => m.Form637Component) },
    { path: 'form720', loadComponent: () => import('./components/forms/form720/form720.component').then(m => m.Form720Component) },
    { path: 'form8849', loadComponent: () => import('./components/forms/form8849/form8849.component').then(m => m.Form8849Component) },
    { path: 'form8801', loadComponent: () => import('./components/forms/form8801/form8801.component').then(m => m.Form8801Component) },
    { path: 'form8834', loadComponent: () => import('./components/forms/form8834/form8834.component').then(m => m.Form8834Component) },
    { path: 'form8582cr', loadComponent: () => import('./components/forms/form8582cr/form8582cr.component').then(m => m.Form8582CRComponent) },
    { path: 'form4626', loadComponent: () => import('./components/forms/form4626/form4626.component').then(m => m.Form4626Component) },
    { path: 'form8810', loadComponent: () => import('./components/forms/form8810/form8810.component').then(m => m.Form8810Component) },
    { path: 'form8880', loadComponent: () => import('./components/forms/form8880/form8880.component').then(m => m.Form8880Component) },
    { path: 'form8911', loadComponent: () => import('./components/forms/form8911/form8911.component').then(m => m.Form8911Component) },
    { path: 'form8912', loadComponent: () => import('./components/forms/form8912/form8912.component').then(m => m.Form8912Component) },
    { path: 'form1097-btc', loadComponent: () => import('./components/forms/form1097-btc/form1097-btc.component').then(m => m.Form1097BTCComponent) },
    { path: 'form1041-schedule-g', loadComponent: () => import('./components/forms/form1041-schedule-g/form1041-schedule-g.component').then(m => m.Form1041ScheduleGComponent) },
    { path: 'form8978', loadComponent: () => import('./components/forms/form8978/form8978.component').then(m => m.Form8978Component) },
    { path: 'form8986', loadComponent: () => import('./components/forms/form8986/form8986.component').then(m => m.Form8986Component) },
    { path: 'schedule8812', loadComponent: () => import('./components/forms/schedule8812/schedule8812.component').then(m => m.Schedule8812Component) },
    { path: 'form4547', loadComponent: () => import('./components/forms/form4547/form4547.component').then(m => m.Form4547Component) },
    { path: 'form-w2pr', loadComponent: () => import('./components/forms/form-w2pr/form-w2pr.component').then(m => m.FormW2PRComponent) },
    { path: 'form5695', loadComponent: () => import('./components/forms/form5695/form5695.component').then(m => m.Form5695Component) },
    { path: 'form8859', loadComponent: () => import('./components/forms/form8859/form8859.component').then(m => m.Form8859Component) },
    { path: 'form8862', loadComponent: () => import('./components/forms/form8862/form8862.component').then(m => m.Form8862Component) },
    { path: 'form8959', loadComponent: () => import('./components/forms/form8959/form8959.component').then(m => m.Form8959Component) },
    { path: 'form-ct2', loadComponent: () => import('./components/forms/form-ct2/form-ct2.component').then(m => m.FormCT2Component) },
    { path: 'form2210', loadComponent: () => import('./components/forms/form2210/form2210.component').then(m => m.Form2210Component) },
    { path: 'form2210f', loadComponent: () => import('./components/forms/form2210f/form2210f.component').then(m => m.Form2210FComponent) },
    { path: 'form-w2c', loadComponent: () => import('./components/forms/form-w2c/form-w2c.component').then(m => m.FormW2cComponent) },
    { path: 'form4952', loadComponent: () => import('./components/forms/form4952/form4952.component').then(m => m.Form4952Component) },
    { path: 'form8396', loadComponent: () => import('./components/forms/form8396/form8396.component').then(m => m.Form8396Component) },
    { path: 'form8828', loadComponent: () => import('./components/forms/form8828/form8828.component').then(m => m.Form8828Component) },
    { path: 'form1098', loadComponent: () => import('./components/forms/form1098/form1098.component').then(m => m.Form1098Component) },
    { path: 'salt-worksheet', loadComponent: () => import('./components/forms/salt-worksheet/salt-worksheet.component').then(m => m.SaltWorksheetComponent) },
    { path: 'sales-tax-worksheet', loadComponent: () => import('./components/forms/sales-tax-worksheet/sales-tax-worksheet.component').then(m => m.SalesTaxWorksheetComponent) },
    { path: 'schedule-b', loadComponent: () => import('./components/forms/schedule-b/schedule-b.component').then(m => m.ScheduleBComponent) },
    { path: 'fbar', loadComponent: () => import('./components/forms/fbar/fbar.component').then(m => m.FbarComponent) },
    { path: 'fbar-auth', loadComponent: () => import('./components/forms/fbar-auth/fbar-auth.component').then(m => m.FbarAuthComponent) },
    { path: 'form1040-sr-new', loadComponent: () => import('./components/forms/form1040-sr/form1040-sr.component').then(m => m.Form1040SRComponent) },
    { path: 'form1096', loadComponent: () => import('./components/forms/form1096/form1096.component').then(m => m.Form1096Component) },
    { path: 'form3921', loadComponent: () => import('./components/forms/form3921/form3921.component').then(m => m.Form3921Component) },
    { path: 'form3922', loadComponent: () => import('./components/forms/form3922/form3922.component').then(m => m.Form3922Component) },
    { path: 'form5498', loadComponent: () => import('./components/forms/form5498/form5498.component').then(m => m.Form5498Component) },
    { path: 'form5498esa', loadComponent: () => import('./components/forms/form5498esa/form5498esa.component').then(m => m.Form5498esaComponent) },
    { path: 'form5498qa', loadComponent: () => import('./components/forms/form5498qa/form5498qa.component').then(m => m.Form5498qaComponent) },
    { path: 'form5498sa', loadComponent: () => import('./components/forms/form5498sa/form5498sa.component').then(m => m.Form5498saComponent) },
    { path: 'formw2g', loadComponent: () => import('./components/forms/formw2g/formw2g.component').then(m => m.FormW2gComponent) },
    { path: 'form1099oid', loadComponent: () => import('./components/forms/form1099oid/form1099oid.component').then(m => m.Form1099oidComponent) },
    { path: 'form1099da', loadComponent: () => import('./components/forms/form1099da/form1099da.component').then(m => m.Form1099daComponent) },
    { path: 'form1099ls', loadComponent: () => import('./components/forms/form1099ls/form1099ls.component').then(m => m.Form1099lsComponent) },
    { path: 'form1099sb', loadComponent: () => import('./components/forms/form1099sb/form1099sb.component').then(m => m.Form1099sbComponent) },
    { path: 'form1098f', loadComponent: () => import('./components/forms/form1098f/form1098f.component').then(m => m.Form1098fComponent) },
    { path: 'form1065', loadComponent: () => import('./components/forms/form1065/form1065.component').then(m => m.Form1065Component) },
    { path: 'sk1-1065', loadComponent: () => import('./components/forms/sk1-1065/sk1-1065.component').then(m => m.Sk11065Component) },
    { path: 'form1120s', loadComponent: () => import('./components/forms/form1120s/form1120s.component').then(m => m.Form1120sComponent) },
    { path: 'f8962', loadComponent: () => import('./components/forms/f8962/f8962.component').then(m => m.F8962Component) },
    { path: 'form4562', loadComponent: () => import('./components/forms/form4562/form4562.component').then(m => m.Form4562Component) },
    { path: 'form4797', loadComponent: () => import('./components/forms/form4797/form4797.component').then(m => m.Form4797Component) },
    { path: 'form1125a', loadComponent: () => import('./components/forms/form1125a/form1125a.component').then(m => m.Form1125aComponent) },
    { path: 'form1125e', loadComponent: () => import('./components/forms/form1125e/form1125e.component').then(m => m.Form1125eComponent) },
    { path: 'form8915f', loadComponent: () => import('./components/forms/form8915f/form8915f.component').then(m => m.Form8915fComponent) },
    { path: 'form8853', loadComponent: () => import('./components/forms/form8853/form8853.component').then(m => m.Form8853Component) },
    { path: 'form8889', loadComponent: () => import('./components/forms/form8889/form8889.component').then(m => m.Form8889Component) },
    { path: 'form8396', loadComponent: () => import('./components/forms/form8396/form8396.component').then(m => m.Form8396Component) },
    { path: 'form8582', loadComponent: () => import('./components/forms/form8582/form8582.component').then(m => m.Form8582Component) },
    { path: 'form8586', loadComponent: () => import('./components/forms/form8586/form8586.component').then(m => m.Form8586Component) },
    { path: 'form8609', loadComponent: () => import('./components/forms/form8609/form8609.component').then(m => m.Form8609Component) },
    { path: 'form8609a', loadComponent: () => import('./components/forms/form8609a/form8609a.component').then(m => m.Form8609aComponent) },
    { path: 'form6251', loadComponent: () => import('./components/forms/form6251/form6251.component').then(m => m.Form6251Component) },
    { path: 'form6252', loadComponent: () => import('./components/forms/form6252/form6252.component').then(m => m.Form6252Component) },
    { path: 'form6765', loadComponent: () => import('./components/forms/form6765/form6765.component').then(m => m.Form6765Component) },
    { path: 'form6781', loadComponent: () => import('./components/forms/form6781/form6781.component').then(m => m.Form6781Component) },
    { path: 'form8824', loadComponent: () => import('./components/forms/form8824/form8824.component').then(m => m.Form8824Component) },
    { path: '**', redirectTo: '' }
];