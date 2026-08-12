import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminProvider } from './AdminContext';
import { HomeScreen } from './screens/HomeScreen';
import { BrandScreen } from './screens/BrandScreen';
import { MenuScreen } from './screens/MenuScreen';
import { MenuItemScreen } from './screens/MenuItemScreen';
import { HeroScreen } from './screens/HeroScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ServiceEditScreen } from './screens/ServiceEditScreen';
import { PlansScreen } from './screens/PlansScreen';
import { PlanEditScreen } from './screens/PlanEditScreen';
import { ValuePropsScreen } from './screens/ValuePropsScreen';
import { ValuePropEditScreen } from './screens/ValuePropEditScreen';
import { BeforeAfterScreen } from './screens/BeforeAfterScreen';
import { BeforeAfterEditScreen } from './screens/BeforeAfterEditScreen';
import { ComfortScreen } from './screens/ComfortScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { ReviewEditScreen } from './screens/ReviewEditScreen';
import { ContactsScreen } from './screens/ContactsScreen';

export default function AdminApp() {
  return (
    <div className="min-h-dvh bg-muted/30">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-background shadow-sm">
        <AdminProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/brand" element={<BrandScreen />} />
              <Route path="/menu" element={<MenuScreen />} />
              <Route path="/menu/:id" element={<MenuItemScreen />} />
              <Route path="/hero" element={<HeroScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/services/:id" element={<ServiceEditScreen />} />
              <Route path="/plans" element={<PlansScreen />} />
              <Route path="/plans/:id" element={<PlanEditScreen />} />
              <Route path="/value-props" element={<ValuePropsScreen />} />
              <Route path="/value-props/:id" element={<ValuePropEditScreen />} />
              <Route path="/before-after" element={<BeforeAfterScreen />} />
              <Route path="/before-after/:id" element={<BeforeAfterEditScreen />} />
              <Route path="/comfort" element={<ComfortScreen />} />
              <Route path="/reviews" element={<ReviewsScreen />} />
              <Route path="/reviews/:id" element={<ReviewEditScreen />} />
              <Route path="/contacts" element={<ContactsScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
          <Toaster position="top-center" theme="light" richColors closeButton />
        </AdminProvider>
      </div>
    </div>
  );
}
