const PROVINCE_NAMES = [
  'Banteay Meanchey',
  'Battambang',
  'Kampong Cham',
  'Kampong Chhnang',
  'Kampong Speu',
  'Kampong Thom',
  'Kampot',
  'Kandal',
  'Kep',
  'Koh Kong',
  'Kratie',
  'Mondulkiri',
  'Oddar Meanchey',
  'Pailin',
  'Phnom Penh',
  'Preah Sihanouk',
  'Preah Vihear',
  'Pursat',
  'Ratanakiri',
  'Siem Reap',
  'Stung Treng',
  'Svay Rieng',
  'Takeo',
  'Tboung Khmum',
  'Prey Veng',
]

function normalizeText(value) {
  return String(value ?? '').trim()
}

function buildVillageName(province, districtIndex, communeIndex, villageIndex) {
  return `${province} Village ${districtIndex + 1}-${communeIndex + 1}-${villageIndex + 1}`
}

function buildCommuneName(province, districtIndex, communeIndex) {
  return `${province} Commune ${districtIndex + 1}-${communeIndex + 1}`
}

function buildDistrictName(province, districtIndex) {
  return `${province} District ${districtIndex + 1}`
}

function createLocationTree() {
  return PROVINCE_NAMES.map((province) => ({
    name: province,
    districts: Array.from({ length: 3 }, (_, districtIndex) => ({
      name: buildDistrictName(province, districtIndex),
      communes: Array.from({ length: 3 }, (_, communeIndex) => ({
        name: buildCommuneName(province, districtIndex, communeIndex),
        villages: Array.from({ length: 3 }, (_, villageIndex) => ({
          name: buildVillageName(province, districtIndex, communeIndex, villageIndex),
        })),
      })),
    })),
  }))
}

export const CAMBODIA_LOCATION_TREE = createLocationTree()

function buildOptions(items = []) {
  return items.map((item) => ({
    label: item.name,
    value: item.name,
  }))
}

function findProvince(provinceName) {
  const normalized = normalizeText(provinceName)
  return CAMBODIA_LOCATION_TREE.find((province) => province.name === normalized) || null
}

function findDistrict(provinceName, districtName) {
  const province = findProvince(provinceName)
  if (!province) return null

  const normalized = normalizeText(districtName)
  return province.districts.find((district) => district.name === normalized) || null
}

function findCommune(provinceName, districtName, communeName) {
  const district = findDistrict(provinceName, districtName)
  if (!district) return null

  const normalized = normalizeText(communeName)
  return district.communes.find((commune) => commune.name === normalized) || null
}

export function getProvinceOptions() {
  return buildOptions(CAMBODIA_LOCATION_TREE)
}

export function getDistrictOptions(provinceName) {
  const province = findProvince(provinceName)
  return province ? buildOptions(province.districts) : []
}

export function getCommuneOptions(provinceName, districtName) {
  const district = findDistrict(provinceName, districtName)
  return district ? buildOptions(district.communes) : []
}

export function getVillageOptions(provinceName, districtName, communeName) {
  const commune = findCommune(provinceName, districtName, communeName)
  return commune ? buildOptions(commune.villages) : []
}

export function buildLocationAddress(source = {}) {
  const village = normalizeText(source.village)
  const commune = normalizeText(source.commune)
  const district = normalizeText(source.district)
  const province = normalizeText(source.province)
  const structuredParts = [village, commune, district, province].filter(Boolean)

  if (structuredParts.length) {
    return structuredParts.join(', ')
  }

  return normalizeText(source.address)
}
