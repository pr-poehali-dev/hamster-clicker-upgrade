import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function Index() {
  const [coins, setCoins] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [maxEnergy, setMaxEnergy] = useState(1000);
  const [clickPower, setClickPower] = useState(1);
  const [autoEarn, setAutoEarn] = useState(0);
  const [popularity, setPopularity] = useState(0);
  
  const [clickUpgradeCost, setClickUpgradeCost] = useState(100);
  const [autoUpgradeCost, setAutoUpgradeCost] = useState(500);
  const [energyUpgradeCost, setEnergyUpgradeCost] = useState(300);
  
  const [clickEffect, setClickEffect] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    if (autoEarn > 0) {
      const interval = setInterval(() => {
        setCoins(prev => prev + autoEarn);
        setPopularity(prev => prev + autoEarn * 0.1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoEarn]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, maxEnergy));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy >= 1) {
      setCoins(prev => prev + clickPower);
      setEnergy(prev => prev - 1);
      setPopularity(prev => prev + 0.1);
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setClickEffect(prev => [...prev, {x, y, id}]);
      setTimeout(() => {
        setClickEffect(prev => prev.filter(effect => effect.id !== id));
      }, 1000);
    }
  };

  const upgradeClickPower = () => {
    if (coins >= clickUpgradeCost) {
      setCoins(prev => prev - clickUpgradeCost);
      setClickPower(prev => prev + 1);
      setClickUpgradeCost(prev => Math.floor(prev * 1.5));
      toast.success('Сила клика увеличена! 💪');
    }
  };

  const upgradeAutoEarn = () => {
    if (coins >= autoUpgradeCost) {
      setCoins(prev => prev - autoUpgradeCost);
      setAutoEarn(prev => prev + 1);
      setAutoUpgradeCost(prev => Math.floor(prev * 1.5));
      toast.success('Пассивный доход увеличен! 🤖');
    }
  };

  const upgradeEnergy = () => {
    if (coins >= energyUpgradeCost) {
      setCoins(prev => prev - energyUpgradeCost);
      setMaxEnergy(prev => prev + 500);
      setEnergy(prev => prev + 500);
      setEnergyUpgradeCost(prev => Math.floor(prev * 1.5));
      toast.success('Максимальная энергия увеличена! ⚡');
    }
  };

  const buyEnergy = () => {
    if (coins >= 50) {
      setCoins(prev => prev - 50);
      setEnergy(prev => Math.min(prev + 100, maxEnergy));
      toast.success('Энергия куплена! ⚡');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#1A1F2C] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#9b87f5] rounded-full filter blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D946EF] rounded-full filter blur-[120px] opacity-20 animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-black/40 border-[#9b87f5] backdrop-blur-sm p-6 shadow-[0_0_20px_rgba(155,135,245,0.3)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#D946EF] flex items-center justify-center shadow-[0_0_20px_rgba(155,135,245,0.5)]">
                <Icon name="Coins" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Монеты</p>
                <p className="text-2xl font-bold text-[#9b87f5]">{Math.floor(coins)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 border-[#0EA5E9] backdrop-blur-sm p-6 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#9b87f5] flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Энергия</p>
                <p className="text-2xl font-bold text-[#0EA5E9]">{Math.floor(energy)}/{maxEnergy}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 border-[#D946EF] backdrop-blur-sm p-6 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D946EF] to-[#9b87f5] flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                <Icon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Популярность</p>
                <p className="text-2xl font-bold text-[#D946EF]">{Math.floor(popularity)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-[#9b87f5] mb-4 flex items-center gap-2">
              <Icon name="Sparkles" size={24} />
              Апгрейды
            </h2>

            <Card className="bg-black/40 border-[#9b87f5] backdrop-blur-sm p-4 hover:shadow-[0_0_30px_rgba(155,135,245,0.4)] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#9b87f5]">Сила клика</h3>
                  <p className="text-sm text-gray-400">+{clickPower} за клик</p>
                </div>
                <Icon name="MousePointerClick" size={24} className="text-[#9b87f5]" />
              </div>
              <Button 
                onClick={upgradeClickPower} 
                disabled={coins < clickUpgradeCost}
                className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] border-0"
              >
                <Icon name="ArrowUp" size={16} className="mr-2" />
                {clickUpgradeCost} монет
              </Button>
            </Card>

            <Card className="bg-black/40 border-[#D946EF] backdrop-blur-sm p-4 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#D946EF]">Автодоход</h3>
                  <p className="text-sm text-gray-400">+{autoEarn}/сек</p>
                </div>
                <Icon name="Bot" size={24} className="text-[#D946EF]" />
              </div>
              <Button 
                onClick={upgradeAutoEarn} 
                disabled={coins < autoUpgradeCost}
                className="w-full bg-gradient-to-r from-[#D946EF] to-[#9b87f5] hover:from-[#9b87f5] hover:to-[#D946EF] border-0"
              >
                <Icon name="ArrowUp" size={16} className="mr-2" />
                {autoUpgradeCost} монет
              </Button>
            </Card>

            <Card className="bg-black/40 border-[#0EA5E9] backdrop-blur-sm p-4 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#0EA5E9]">Макс. энергия</h3>
                  <p className="text-sm text-gray-400">{maxEnergy} единиц</p>
                </div>
                <Icon name="Battery" size={24} className="text-[#0EA5E9]" />
              </div>
              <Button 
                onClick={upgradeEnergy} 
                disabled={coins < energyUpgradeCost}
                className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#9b87f5] hover:from-[#9b87f5] hover:to-[#0EA5E9] border-0"
              >
                <Icon name="ArrowUp" size={16} className="mr-2" />
                {energyUpgradeCost} монет
              </Button>
            </Card>

            <Card className="bg-black/40 border-[#F97316] backdrop-blur-sm p-4 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#F97316]">Купить энергию</h3>
                  <p className="text-sm text-gray-400">+100 энергии</p>
                </div>
                <Icon name="ShoppingCart" size={24} className="text-[#F97316]" />
              </div>
              <Button 
                onClick={buyEnergy} 
                disabled={coins < 50}
                className="w-full bg-gradient-to-r from-[#F97316] to-[#D946EF] hover:from-[#D946EF] hover:to-[#F97316] border-0"
              >
                <Icon name="Zap" size={16} className="mr-2" />
                50 монет
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-[#9b87f5] backdrop-blur-sm p-8 shadow-[0_0_40px_rgba(155,135,245,0.3)] h-full flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 via-transparent to-[#D946EF]/10" />
              
              <h2 className="text-3xl font-bold text-center mb-4 relative z-10 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
                КИБЕРХОМЯК
              </h2>
              
              <div className="relative mb-6">
                <div 
                  className="text-[200px] cursor-pointer select-none transition-transform hover:scale-110 active:scale-95 relative z-10"
                  onClick={handleClick}
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(155, 135, 245, 0.6))',
                  }}
                >
                  🐹
                </div>
                
                {clickEffect.map(effect => (
                  <div
                    key={effect.id}
                    className="absolute text-2xl font-bold text-[#9b87f5] pointer-events-none animate-fade-out"
                    style={{
                      left: effect.x,
                      top: effect.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    +{clickPower}
                  </div>
                ))}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[220px] h-[220px] rounded-full border-4 border-[#9b87f5]/30 animate-[ping_2s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="w-full max-w-md space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Энергия</span>
                    <span className="text-sm font-bold text-[#0EA5E9]">{Math.floor(energy)}/{maxEnergy}</span>
                  </div>
                  <Progress value={(energy / maxEnergy) * 100} className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-[#0EA5E9] [&>div]:to-[#9b87f5] shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/60 p-4 rounded-lg border border-[#9b87f5]/30">
                    <p className="text-sm text-gray-400 mb-1">Клик</p>
                    <p className="text-2xl font-bold text-[#9b87f5]">+{clickPower}</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-lg border border-[#D946EF]/30">
                    <p className="text-sm text-gray-400 mb-1">В секунду</p>
                    <p className="text-2xl font-bold text-[#D946EF]">+{autoEarn}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}