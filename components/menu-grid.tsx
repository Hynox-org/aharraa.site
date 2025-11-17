import React from "react"
import { Menu } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MenuGridProps {
  menus: Menu[];
  selectedMenu: Menu | null;
  onMenuSelect: (menu: Menu) => void;
}

export function MenuGrid({ menus, selectedMenu, onMenuSelect }: MenuGridProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select a Menu</CardTitle>
      </CardHeader>
      <CardContent>
        {menus.length === 0 ? (
          <p className="text-center text-gray-500">No menus available for this vendor.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menus.map((menu) => (
              <Button
                key={menu._id}
                variant={selectedMenu?._id === menu._id ? "default" : "outline"}
                onClick={() => onMenuSelect(menu)}
                className="flex flex-col h-auto p-4 text-center"
              >
                {menu.coverImage && (
                  <Image
                    src={menu.coverImage}
                    alt={menu.name}
                    width={80}
                    height={80}
                    className="rounded-full mb-2 object-cover"
                  />
                )}
                <span className="font-semibold">{menu.name}</span>
                {menu.description && (
                  <p className="text-sm text-gray-500 mt-1">{menu.description}</p>
                )}
                <p className="text-sm text-gray-700 mt-1">Price: ₹{menu.perDayPrice}</p>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
