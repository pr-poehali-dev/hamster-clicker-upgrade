import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Tender {
  id: number;
  title: string;
  customer: string;
  region: string;
  budget: number;
  deadline: string;
  status: 'active' | 'ending-soon' | 'closed';
  category: string;
  participantsCount: number;
}

const mockTenders: Tender[] = [
  {
    id: 1,
    title: 'Поставка новогодних подарков для детей сотрудников',
    customer: 'ООО "Газпром Нефть"',
    region: 'Санкт-Петербург',
    budget: 2500000,
    deadline: '2025-12-20',
    status: 'active',
    category: 'Детские подарки',
    participantsCount: 12,
  },
  {
    id: 2,
    title: 'Закупка новогодних подарочных наборов для партнеров',
    customer: 'ПАО "Сбербанк"',
    region: 'Москва',
    budget: 5000000,
    deadline: '2025-12-18',
    status: 'ending-soon',
    category: 'Корпоративные подарки',
    participantsCount: 24,
  },
  {
    id: 3,
    title: 'Новогодние подарки для многодетных семей',
    customer: 'Администрация Краснодарского края',
    region: 'Краснодар',
    budget: 1800000,
    deadline: '2025-12-22',
    status: 'active',
    category: 'Социальные программы',
    participantsCount: 8,
  },
  {
    id: 4,
    title: 'Подарочные наборы для новогоднего корпоратива',
    customer: 'ООО "Яндекс"',
    region: 'Москва',
    budget: 3200000,
    deadline: '2025-12-25',
    status: 'active',
    category: 'Корпоративные подарки',
    participantsCount: 15,
  },
  {
    id: 5,
    title: 'Новогодние сладкие подарки для школьников',
    customer: 'Департамент образования Екатеринбурга',
    region: 'Екатеринбург',
    budget: 980000,
    deadline: '2025-12-15',
    status: 'ending-soon',
    category: 'Детские подарки',
    participantsCount: 6,
  },
  {
    id: 6,
    title: 'Премиальные новогодние подарки для VIP-клиентов',
    customer: 'ПАО "ВТБ"',
    region: 'Москва',
    budget: 4500000,
    deadline: '2025-12-28',
    status: 'active',
    category: 'Премиум сегмент',
    participantsCount: 10,
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tender.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || tender.region === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || tender.category === selectedCategory;
    const matchesMinBudget = !minBudget || tender.budget >= parseInt(minBudget);
    const matchesMaxBudget = !maxBudget || tender.budget <= parseInt(maxBudget);

    return matchesSearch && matchesRegion && matchesCategory && matchesMinBudget && matchesMaxBudget;
  });

  const getStatusBadge = (status: Tender['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Активен</Badge>;
      case 'ending-soon':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Скоро закроется</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Закрыт</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBudget = filteredTenders.reduce((sum, t) => sum + t.budget, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F0FB] via-white to-[#FDE1D3]">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#ea384c]/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Gift" size={48} className="text-[#ea384c]" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ea384c] to-[#F97316] bg-clip-text text-transparent">
              Тендеры на Новогодние Подарки
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Поиск государственных и корпоративных закупок новогодних подарков по всей России
          </p>
        </header>

        <Card className="p-6 mb-8 shadow-lg border-2 border-[#ea384c]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по названию или заказчику..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Регион" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все регионы</SelectItem>
                <SelectItem value="Москва">Москва</SelectItem>
                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                <SelectItem value="Краснодар">Краснодар</SelectItem>
                <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="Детские подарки">Детские подарки</SelectItem>
                <SelectItem value="Корпоративные подарки">Корпоративные подарки</SelectItem>
                <SelectItem value="Социальные программы">Социальные программы</SelectItem>
                <SelectItem value="Премиум сегмент">Премиум сегмент</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-to-r from-[#ea384c] to-[#F97316] hover:from-[#d62f3f] hover:to-[#e8670a]">
              <Icon name="Filter" size={20} className="mr-2" />
              Применить
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              type="number"
              placeholder="Минимальный бюджет (₽)"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Максимальный бюджет (₽)"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[#ea384c] to-[#F97316] text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="FileText" size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Найдено тендеров</p>
                <p className="text-3xl font-bold">{filteredTenders.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#0EA5E9] to-[#9b87f5] text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="DollarSign" size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Общий бюджет</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#F97316] to-[#ea384c] text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="Users" size={32} />
              </div>
              <div>
                <p className="text-sm opacity-90">Всего участников</p>
                <p className="text-3xl font-bold">{filteredTenders.reduce((sum, t) => sum + t.participantsCount, 0)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredTenders.map((tender) => (
            <Card key={tender.id} className="p-6 hover:shadow-xl transition-shadow border-l-4 border-l-[#ea384c]">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="Gift" size={24} className="text-[#ea384c] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{tender.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(tender.status)}
                        <Badge variant="outline" className="border-[#0EA5E9] text-[#0EA5E9]">
                          {tender.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon name="Building2" size={16} className="text-gray-400" />
                      <span><strong>Заказчик:</strong> {tender.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-gray-400" />
                      <span><strong>Регион:</strong> {tender.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-gray-400" />
                      <span><strong>Дедлайн:</strong> {new Date(tender.deadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} className="text-gray-400" />
                      <span><strong>Участников:</strong> {tender.participantsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4 md:min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Бюджет</p>
                    <p className="text-2xl font-bold text-[#ea384c]">{formatCurrency(tender.budget)}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedTender(tender);
                      setIsDialogOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-[#ea384c] to-[#F97316] hover:from-[#d62f3f] hover:to-[#e8670a]"
                  >
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    Подробнее
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTenders.length === 0 && (
          <Card className="p-12 text-center">
            <Icon name="SearchX" size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Тендеры не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTender && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 pr-8">
                  {selectedTender.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getStatusBadge(selectedTender.status)}
                    <Badge variant="outline" className="border-[#0EA5E9] text-[#0EA5E9]">
                      {selectedTender.category}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-[#ea384c] to-[#F97316] text-white">
                    <p className="text-sm opacity-90 mb-1">Бюджет тендера</p>
                    <p className="text-3xl font-bold">{formatCurrency(selectedTender.budget)}</p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-[#0EA5E9] to-[#9b87f5] text-white">
                    <p className="text-sm opacity-90 mb-1">Участников</p>
                    <p className="text-3xl font-bold">{selectedTender.participantsCount}</p>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="Building2" size={20} className="text-[#ea384c] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Заказчик</p>
                      <p className="text-gray-600">{selectedTender.customer}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="MapPin" size={20} className="text-[#ea384c] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Регион</p>
                      <p className="text-gray-600">{selectedTender.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="Calendar" size={20} className="text-[#ea384c] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Срок подачи заявок</p>
                      <p className="text-gray-600">{new Date(selectedTender.deadline).toLocaleDateString('ru-RU', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="FileText" size={20} className="text-[#ea384c] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Описание закупки</p>
                      <p className="text-gray-600">
                        Закупка новогодних подарков согласно требованиям заказчика. 
                        Подарки должны соответствовать всем стандартам качества и безопасности.
                        Поставка осуществляется в регион {selectedTender.region} в срок до {new Date(selectedTender.deadline).toLocaleDateString('ru-RU')}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Icon name="Package" size={20} className="text-[#ea384c] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Требования к подарку</p>
                      <ul className="text-gray-600 list-disc list-inside space-y-1">
                        <li>Соответствие ГОСТам и СанПиН</li>
                        <li>Сертификаты качества на все товары</li>
                        <li>Упаковка с новогодним дизайном</li>
                        <li>Гарантия возврата бракованной продукции</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-[#ea384c] to-[#F97316] hover:from-[#d62f3f] hover:to-[#e8670a]">
                    <Icon name="Send" size={16} className="mr-2" />
                    Подать заявку
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}