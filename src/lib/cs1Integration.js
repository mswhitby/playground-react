// This bridge is built from the canonical mswhitby/playground source, not from
// the React design lab. VITE_READONLY_INTEGRATION enables it only in an isolated build.
export const cs1IntegrationMode = import.meta.env.VITE_READONLY_INTEGRATION === 'true';

export async function loadCs1ReadOnlyAccount(){
  if(!cs1IntegrationMode)return {status:'disabled',grades:[],weeklyPoints:[]};
  const bridgeUrl = '/playground/integration/' + 'account-bridge.js';
  const {readOnlyCs1Snapshot}=await import(/* @vite-ignore */ bridgeUrl);
  return readOnlyCs1Snapshot();
}
