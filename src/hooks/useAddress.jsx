import { useState } from "react";
import useQuery from "./useQuery";
import { authenService } from "@/services/authenService";

const useAddress = (defaultValues) => {
  const [provinceId, setProvinceId] = useState(defaultValues?.provinceId);
  const [districtId, setDistrictId] = useState(defaultValues?.districtId);
  const [wardId, setWardId] = useState(defaultValues?.wardId);

  const { data : provinceList  } = useQuery(authenService.getProvince);
  const provinceData = provinceList?.provinces || []
 
  const { data: districtList } = useQuery(
    () => provinceId && authenService.getDistrict(provinceId),
    [provinceId]
  );

  const districtData = districtList?.districts || []

  const { data: wardList } = useQuery(
    () => districtId && authenService.getWard(districtId),
    [districtId]
  );
  const wardData =  wardList?.wards || []

  const handleProvinceChange = (changeId) => {
     setProvinceId(changeId)
     setDistrictId(undefined)
     setWardId(undefined)
  }
  const handleDistrictChange = (changeId) => {
    setDistrictId(changeId)
    setWardId(undefined)
  }

  const handleWardChange = (changeId) => {
    setWardId(changeId)
  }

  return {
    provinces : provinceData?.map((item)=>{
        return {
            value: item.id,
            label : item.name
        }
    }) || [],
    districts : districtData?.map((item) => {
        return {
            value: item.id,
            label : item.name
        
        }
    }) || [],
    wards : wardData?.map((item) => {
        return {
            value: item.id,
            label : item.name
        }
    }) || [],
    provinceId,
    districtId,
    wardId,
    handleDistrictChange,
    handleProvinceChange,
    handleWardChange
  }
};

export default useAddress
