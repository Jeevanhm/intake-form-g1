
/**
 * Maps the form data object to the Supabase database schema
 */
export const mapFormDataToSupabase = (formData: any, weekDate: string) => {
  return {
    app_name: formData.appName,
    requestor: formData.requestor,
    app_owner: formData.appOwner,
    l1_leadership: formData.l1Leadership,
    date_requested: formData.dateRequested,
    funding_available: formData.fundingAvailable,
    fund_code: formData.fundCode,
    cost: formData.cost,
    cms_full_support: formData.cmsFullSupport,
    exceptions_to_cms: formData.exceptionsToCMS,
    backup: formData.backup,
    dr: formData.dr,
    physical: formData.physical,
    reason_for_physical: formData.reasonForPhysical,
    on_prem: formData.onPrem,
    reason_for_on_prem: formData.reasonForOnPrem,
    azure: formData.azure,
    location_on_prem: formData.locationOnPrem,
    data_center_location: formData.dataCenterLocation,
    location_physical: formData.locationPhysical,
    location_reason_for_physical: formData.locationReasonForPhysical,
    sql: formData.sql,
    oracle: formData.oracle,
    other_explain: formData.otherExplain,
    prod_count: formData.prodCount,
    non_prod_count: formData.nonProdCount,
    dr_count: formData.drCount,
    env_prod: formData.envProd,
    env_non_prod: formData.envNonProd,
    env_dr: formData.envDR,
    azure_type: formData.azureType,
    azure_volume: formData.azureVolume,
    storage_on_prem: formData.storageOnPrem,
    on_prem_volume: formData.onPremVolume,
    other_notes: formData.otherNotes,
    week_date: weekDate
  };
};
