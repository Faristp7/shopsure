'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ModeSwitcherProps {
  mode: 'manual' | 'auto';
  onModeChange: (mode: 'manual' | 'auto') => void;
  autoRule: string;
  onAutoRuleChange: (rule: string) => void;
}

export function ModeSwitcher({ mode, onModeChange, autoRule, onAutoRuleChange }: ModeSwitcherProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Selection Mode</CardTitle>
        <CardDescription>
          Choose how you want to populate your featured products on the homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => onModeChange(v as 'manual' | 'auto')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Selection</TabsTrigger>
            <TabsTrigger value="auto">Auto (Rules-based)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-4">
            <p className="text-sm text-muted-foreground">
              You manually pick, arrange, and schedule specific products. Best for curated campaigns.
            </p>
          </TabsContent>
          
          <TabsContent value="auto" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto-rule">Automatic Selection Rule</Label>
              <Select value={autoRule} onValueChange={onAutoRuleChange}>
                <SelectTrigger id="auto-rule">
                  <SelectValue placeholder="Select a rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top_selling">Top Selling</SelectItem>
                  <SelectItem value="most_viewed">Most Viewed</SelectItem>
                  <SelectItem value="highest_rated">Highest Rated</SelectItem>
                  <SelectItem value="recently_added">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              The platform will automatically update the featured section based on this rule. 
              Products that go out of stock or get disabled will be skipped.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
