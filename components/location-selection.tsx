"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { MapPin, LocateFixed, Loader2, Check } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { DeliveryAddress, LocationSelectionProps } from "@/lib/types"

const predefinedLocations: DeliveryAddress[] = [
  {
    addressLine1: "123 Main St",
    city: "Downtown",
    state: "CA",
    zipCode: "90012",
    formattedAddress: "123 Main St, Downtown, CA 90012",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    addressLine1: "456 Oak Ave",
    city: "Uptown",
    state: "CA",
    zipCode: "90210",
    formattedAddress: "456 Oak Ave, Uptown, CA 90210",
    latitude: 34.0736,
    longitude: -118.4004,
  },
  {
    addressLine1: "789 Pine Ln",
    city: "Midtown",
    state: "CA",
    zipCode: "90048",
    formattedAddress: "789 Pine Ln, Midtown, CA 90048",
    latitude: 34.0625,
    longitude: -118.3581,
  },
]


export function LocationSelection({ mealType }: LocationSelectionProps) {
  const deliveryAddresses = useStore((state) => state.deliveryAddresses);
  const setDeliveryAddress = useStore((state) => state.setDeliveryAddress);

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const selectedAddress = deliveryAddresses[mealType];

  useEffect(() => {
    if (selectedAddress) {
      setAddressLine1(selectedAddress.addressLine1 || "");
      setAddressLine2(selectedAddress.addressLine2 || "");
      setCity(selectedAddress.city || "");
      setState(selectedAddress.state || "");
      setZipCode(selectedAddress.zipCode || "");
      setLatitude(selectedAddress.latitude);
      setLongitude(selectedAddress.longitude);
      setFormattedAddress(selectedAddress.formattedAddress || "");
    } else {
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setZipCode("");
      setLatitude(undefined);
      setLongitude(undefined);
      setFormattedAddress("");
    }
  }, [selectedAddress]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          const dummyAddress: DeliveryAddress = {
            addressLine1: "Current Location St",
            city: "Current City",
            state: "CS",
            zipCode: "00000",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            formattedAddress: `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`,
          };
          setDeliveryAddress(mealType, dummyAddress);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred.");
              break;
          }
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleManualAddressSave = () => {
    if (addressLine1 && city && state && zipCode) {
      const newAddress: DeliveryAddress = {
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        formattedAddress: `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}, ${city}, ${state} ${zipCode}`,
      };
      setDeliveryAddress(mealType, newAddress);
      setShowManualForm(false);
    } else {
      setLocationError("Please fill in all required address fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2 capitalize">
          {mealType} Delivery
        </h2>
        <p className="text-neutral-600">Choose your delivery location</p>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Check className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900 mb-1">Delivering to</p>
              <p className="text-lg font-semibold text-neutral-900">{selectedAddress.formattedAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Location Button */}
      <div className="mb-8">
        <Button
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          size="lg"
          className="w-full h-14 text-base font-medium bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Detecting location...
            </>
          ) : (
            <>
              <LocateFixed className="h-5 w-5 mr-2" />
              Use My Current Location
            </>
          )}
        </Button>
        {locationError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{locationError}</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-sm text-neutral-500 bg-white">or select from saved addresses</span>
        </div>
      </div>

      {/* Predefined Locations Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Saved Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => setDeliveryAddress(mealType, location)}
              className={`group relative p-5 rounded-xl transition-all text-left overflow-hidden ${
                selectedAddress?.formattedAddress === location.formattedAddress
                  ? "bg-orange-500 shadow-lg shadow-orange-200"
                  : "bg-white border-2 border-neutral-200 hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedAddress?.formattedAddress === location.formattedAddress
                    ? "bg-white/20"
                    : "bg-orange-100 group-hover:bg-orange-200"
                }`}>
                  <MapPin 
                    className={selectedAddress?.formattedAddress === location.formattedAddress ? "text-white" : "text-orange-500"} 
                    size={20} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm leading-relaxed ${
                    selectedAddress?.formattedAddress === location.formattedAddress
                      ? "text-white"
                      : "text-neutral-900"
                  }`}>
                    {location.formattedAddress}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Address Section */}
      <div className="border-t border-neutral-200 pt-8">
        {!showManualForm ? (
          <Button
            onClick={() => setShowManualForm(true)}
            variant="outline"
            size="lg"
            className="w-full h-12 border-2 border-dashed border-neutral-300 hover:border-orange-400 hover:bg-orange-50"
          >
            + Add New Address
          </Button>
        ) : (
          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Enter New Address</h3>
              <Button
                onClick={() => setShowManualForm(false)}
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-neutral-700"
              >
                Cancel
              </Button>
            </div>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor={`${mealType}-addressLine1`} className="text-sm font-medium text-neutral-700 mb-2">
                  Street Address *
                </Label>
                <Input
                  id={`${mealType}-addressLine1`}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g., 123 Main Street"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor={`${mealType}-addressLine2`} className="text-sm font-medium text-neutral-700 mb-2">
                  Apartment, Suite, etc. (Optional)
                </Label>
                <Input
                  id={`${mealType}-addressLine2`}
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g., Apt 4B"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`${mealType}-city`} className="text-sm font-medium text-neutral-700 mb-2">
                    City *
                  </Label>
                  <Input
                    id={`${mealType}-city`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor={`${mealType}-state`} className="text-sm font-medium text-neutral-700 mb-2">
                    State *
                  </Label>
                  <Input
                    id={`${mealType}-state`}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor={`${mealType}-zipCode`} className="text-sm font-medium text-neutral-700 mb-2">
                    Zip Code *
                  </Label>
                  <Input
                    id={`${mealType}-zipCode`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip"
                    className="h-12"
                  />
                </div>
              </div>

              <Button 
                onClick={handleManualAddressSave} 
                size="lg"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600"
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
