import React, { useState } from 'react';
import {
  ActiveTab,
  SpringData,
  RechargeZoneData,
  InterventionSiteData,
  RiskZoneData,
  CommunityObservationData
} from './types';
import {
  DEMO_SPRINGS,
  DEMO_RECHARGE_ZONES,
  DEMO_INTERVENTION_SITES,
  DEMO_RISK_ZONES,
  DEMO_COMMUNITY_OBSERVATIONS
} from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { SpringExplorerView } from './components/springs/SpringExplorerView';
import { RechargeZonesView } from './components/recharge/RechargeZonesView';
import { InterventionPlanningView } from './components/interventions/InterventionPlanningView';
import { RiskAssessmentView } from './components/risk/RiskAssessmentView';
import { FieldValidationView } from './components/validation/FieldValidationView';
import { CommunityObservationsView } from './components/community/CommunityObservationsView';
import { ReportsView } from './components/reports/ReportsView';
import { DataManagementView } from './components/data/DataManagementView';
import { X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [springs, setSprings] = useState<SpringData[]>(DEMO_SPRINGS);
  const [rechargeZones, setRechargeZones] = useState<RechargeZoneData[]>(DEMO_RECHARGE_ZONES);
  const [interventionSites, setInterventionSites] = useState<InterventionSiteData[]>(DEMO_INTERVENTION_SITES);
  const [riskZones] = useState<RiskZoneData[]>(DEMO_RISK_ZONES);
  const [communityObservations, setCommunityObservations] = useState<CommunityObservationData[]>(DEMO_COMMUNITY_OBSERVATIONS);

  // Selected cross-tab entities
  const [selectedZoneId, setSelectedZoneId] = useState<string>('rz-21');
  const [selectedValidationSiteId, setSelectedValidationSiteId] = useState<string>('int-07');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update site status (e.g., Pending Verification -> Verified Valid)
  const handleUpdateSiteStatus = (
    siteId: string,
    newStatus: InterventionSiteData['status'],
    notes?: string
  ) => {
    setInterventionSites(prev =>
      prev.map(site => {
        if (site.id === siteId) {
          return {
            ...site,
            status: newStatus,
            verificationNotes: notes || site.verificationNotes,
            verifiedDate: new Date().toISOString().split('T')[0],
            verifiedBy: 'S. Mohapatra (Field Verification)',
          };
        }
        return site;
      })
    );
  };

  // Add new community observation
  const handleAddCommunityObservation = (newObs: CommunityObservationData) => {
    setCommunityObservations(prev => [newObs, ...prev]);
  };

  // Cross-tab jump to Recharge Zone
  const handleSelectRechargeZoneById = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setActiveTab('recharge');
  };

  // Pending validation count
  const pendingCount = interventionSites.filter(s => s.status === 'Pending Verification').length;
  const highRiskCount = riskZones.filter(r => r.riskLevel === 'HIGH').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          pendingValidationCount={pendingCount}
          highRiskCount={highRiskCount}
        />
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-2xs">
          <div className="w-64 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex justify-end p-2 border-b border-slate-100">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                pendingValidationCount={pendingCount}
                highRiskCount={highRiskCount}
              />
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Government Header */}
        <Header
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectRechargeZoneById={handleSelectRechargeZoneById}
            />
          )}

          {activeTab === 'springs' && (
            <SpringExplorerView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectRechargeZoneById={handleSelectRechargeZoneById}
            />
          )}

          {activeTab === 'recharge' && (
            <RechargeZonesView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              selectedZoneId={selectedZoneId}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'interventions' && (
            <InterventionPlanningView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onUpdateSiteStatus={handleUpdateSiteStatus}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectSiteForValidation={(site) => {
                setSelectedValidationSiteId(site.id);
                setActiveTab('validation');
              }}
            />
          )}

          {activeTab === 'risk' && (
            <RiskAssessmentView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'validation' && (
            <FieldValidationView
              interventionSites={interventionSites}
              springs={springs}
              selectedSiteId={selectedValidationSiteId}
              onUpdateSiteStatus={handleUpdateSiteStatus}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'community' && (
            <CommunityObservationsView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onAddObservation={handleAddCommunityObservation}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              springs={springs}
              rechargeZones={rechargeZones}
              interventionSites={interventionSites}
              riskZones={riskZones}
              communityObservations={communityObservations}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'data' && (
            <DataManagementView
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
