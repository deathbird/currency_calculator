<?php
/**
 * Created by PhpStorm.
 * User: jdi
 * Date: 12/12/2018
 * Time: 9:26 μμ
 */

namespace App\Services;


use Symfony\Component\HttpFoundation\Session\SessionInterface;

class RatesService
{
    private $storage;

    public function __construct(SessionInterface $session)
    {
        $this->storage = $session;
    }

    public function getExchangeRates()
    {
        $val = $this->storage->get('rates');
        if (empty($val)) {
            $val = [
                'EUR' => [
                    'rates' => [
                        'USD' => 1.3764,
                        'CHF' => 1.2079,
                        'GBP' => 0.8731,
                    ]
                ],
                'USD' => [
                    'rates' => [
                        'EUR' => 1/1.3764,
                        'CHF' => 1/1.1379,
                        'JPY' => 76.7200,
                        'CAD' => 1.3357,
                    ]
                ],
                'CAD' => [
                    'rates' => [
                        'GBP' => 1/1.5648,
                    ]
                ],
                'GBP' => [
                    'rates' => [
                        'EUR' => 1/0.8731,
                        'CAD' => 1.5648,
                        'USD' => 1.2651,
                    ]
                ],
                'CHF' => [
                    'rates' => [
                        'USD' => 1.1379,
                        'EUR' => 1/1.2079,
                    ]
                ],
                'JPY' => [
                    'rates' => [
                        'USD' => 1/76.7200,
                    ]
                ],
                'NZD' => [
                    'rates' => [
                        'USD' => 0.6861,
                    ]
                ],
            ];
            $this->storage->set('rates', $val);
        }
        return $val;
    }

    public function insert($base, $target, $rate)
    {
        $rates = $this->storage->get('rates');
        if (isset($rates[$base]['rates'][$target])) {
            throw new \Exception('Rate exists!');
        }
        $rates[$base]['rates'][$target] = $rate;
        $this->storage->set('rates', $rates);
        return true;
    }

    public function update($base, $target, $rate)
    {
        $rates = $this->storage->get('rates');
        if (!isset($rates[$base]['rates'][$target])) {
            throw new \Exception('Rate does NOT exist!');
        }
        $rates[$base]['rates'][$target] = $rate;
        $this->storage->set('rates', $rates);
        return true;
    }
}