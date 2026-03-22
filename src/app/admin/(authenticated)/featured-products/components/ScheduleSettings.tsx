'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ScheduleSettingsProps {
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
}

export function ScheduleSettings({
  isActive,
  onActiveChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: ScheduleSettingsProps) {
  return (
    <Card>
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b mb-6">
        <div>
          <CardTitle>Status & Schedule</CardTitle>
          <CardDescription className="mt-1">
            Control when the featured products rail is visible on the storefront.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {isActive ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          <Switch 
            id="is-active" 
            checked={isActive} 
            onCheckedChange={onActiveChange} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          If no dates are picked, the featured products rail will remain visible indefinitely as long as it is Active.
        </p>
      </CardContent>
    </Card>
  );
}
